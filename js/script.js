/******************************************************************************/
/* Treehouse Full Stack Javascript Tech Degree                                */
/* Project #2: Pagination & Content Filter + EXTRA CREDIT                     */
/* Author: lis22                                                              */
/* Date: Oct 17, 2016                                                         */
/******************************************************************************/

//IFFE to wrap up variables from being global
(function(){

    var key;
    var currentPage = 1;
    var studentList = document.getElementsByClassName("student-list")[0].children;

    addPageElements();
    getPages(studentList.length);
    paginateList(studentList);

    /**************************************************************************/
    /* toggleActive()                                                         */
    /* Used to change which pagination button link is active                  */
    /**************************************************************************/
    function toggleActive(index, isActive) {
        var pageList = document.getElementsByClassName("pagination")[0];

        if (isActive)
            pageList.children[index-1].children[0].classList.add("active");
        else
            pageList.children[index-1].children[0].classList.remove("active");
    }

    /**************************************************************************/
    /* addPageElements()                                                      */
    /* Creates input box, search button, pagination links holder, an error    */
    /* message area, and appends these all to the page                        */
    /**************************************************************************/
    function addPageElements() {
        var searchDiv = document.createElement("div");
        searchDiv.classList.add("student-search");

        var inputBox = document.createElement("input");
        inputBox.placeholder = "Search for students...";
        inputBox.id = "inputBox";
        searchDiv.appendChild(inputBox);

        var searchBtn = document.createElement("button");
        searchBtn.innerText = "search";
        searchBtn.id = "searchBtn";
        searchDiv.appendChild(searchBtn);
        document.querySelector(".page-header").appendChild(searchDiv);

        var paginationList = document.createElement("ul");
        paginationList.classList.add("pagination");
        document.querySelector(".page").appendChild(paginationList);

        //extra credit search error container
        var error = document.createElement("div");
        error.id = "error";
        document.querySelector(".page").appendChild(error);
    }

    /**************************************************************************/
    /* Pagination Event Handler                                               */
    /* Listens for click events on pagination class, determines if a link     */
    /* was clicked, if so calls to remove the old active toggle on the link,  */
    /* resets the currentPage to the new page and marks it active. Then calls */
    /* to figure out if the paginated links are from a search performed or    */
    /* the default full set paginated.                                        */
    /**************************************************************************/
    document.getElementsByClassName("pagination")[0].addEventListener("click",function(event){
        if(event.target.nodeName === "A") {
            toggleActive(currentPage, false);
            currentPage = event.target.innerText;
            toggleActive(currentPage, true);
            determinePurpose();
        }
    });
    /**************************************************************************/
    /* Student Search Button Event Handler                                    */
    /* When the button is pressed, gets the value from the input field,       */
    /* validates the value isn't empty and calls to determine purpose         */
    /**************************************************************************/
    document.getElementById("searchBtn").addEventListener("click",function() {
        var inputText = this.previousElementSibling.value;
        key = inputText;
        if (key === "")
            alert("You must enter a value to search");
        determinePurpose();

    });

    /**************************************************************************/
    /* Student Search Input Event Handler                                     */
    /* When text is entered, gets the value from the input field,             */
    /* if empty, then resets to original list and calls to determine purpose  */
    /* This is for EXTRA CREDIT dynamically filter student listings           */
    /**************************************************************************/
    document.getElementById("inputBox").addEventListener("keyup", function(event) {
        var inputText = event.target.value;
        key = inputText;
        if (key === "")
            getPages(studentList.length);
        determinePurpose();
    });

    /**************************************************************************/
    /* getPages()                                                             */
    /* Accepts the list item count and determines how many pages to display   */
    /* If list is there calls to remove list items, performs a reset of       */
    /* currentPage to fix a bug when a user searches from a higher page       */
    /* number than the results has, calls to add the page links as long as    */
    /* there is more than 1 page and calls to make the link active            */
    /**************************************************************************/
    function getPages(listItemCount) {
        var list = document.getElementsByClassName("pagination")[0];
        var displayPerPage = 10;
        var maxPages =  Math.ceil(listItemCount / displayPerPage);

        if(list)
            removePages(list);

        if(currentPage > maxPages) {
            currentPage = 1;
        }
        if (maxPages > 1 ) {
            addPages(maxPages,list);
            toggleActive(currentPage,true);
        }
    }

    /**************************************************************************/
    /* removePages                                                            */
    /* removes li items from ul list                                          */
    /**************************************************************************/
    function removePages(list) {
        list.innerHTML = "";
    }

    /**************************************************************************/
    /* addPages                                                               */
    /* Accepts page count and the pagination ul list                          */
    /* creates and add li items including links to ul pagination              */
    /**************************************************************************/
    function addPages(pageCount,list) {
        for(var i=1; i<=pageCount; i++) {
            var btn = document.createElement("li");
            var link = document.createElement("a");
            link.innerText = i;
            link.setAttribute("href", "#" +i );
            btn.appendChild(link);
            list.appendChild(btn);
        }
    }

    /**************************************************************************/
    /* determinePurpose()                                                     */
    /* If there is a search key, it will call searchList to find the matching */
    /* elements, call to create page links with count of matching elements,   */
    /* and display the search results. When key is undefined or empty, that   */
    /* means no search was performed, so it calls to paginates the full list  */
    /* and sets last page                                                     */
    /**************************************************************************/
    function determinePurpose() {
        var count;

        if (key) {
            count = searchList();
            getPages(count);
            getSearchResults();
        }
        else
            paginateList(studentList);
    }

    /**************************************************************************/
    /* searchList()                                                           */
    /* Looks for specified key in the list of names and emails, ignores       */
    /* casing in the search, and  search result must match the key at a word  */
    /* boundary in the beginning, example: if searching "sa" sara will match, */
    /* but elsa will NOT match. It then marks the list items with a class     */
    /* of show or hide so results can be shown paginated.                     */
    /**************************************************************************/
    function searchList() {
        var pattern = new RegExp("\\b"+key, "i");
        var matchingCount=0;

        for(var i=0; i<studentList.length; i++) {
            var name = studentList[i].getElementsByTagName("H3")[0].innerText;
            var email = studentList[i].getElementsByClassName("email")[0].innerText;

            studentList[i].style.display="none";

            if (pattern.test(name) || pattern.test(email))  {
                studentList[i].classList.add("show");
                studentList[i].classList.remove("hide");
                matchingCount++;
            }
            else {
                studentList[i].classList.remove("show");
                studentList[i].classList.add("hide");
            }
        }
        return matchingCount;
    }

    /**************************************************************************/
    /* getSearchResults()                                                     */
    /* Retrieves the elements with show and hide classes, calls to hide the   */
    /* unmatched elements, shows EXTRA CREDIT  message if no matching         */
    /* elements. Calls to display the matching elements in pages              */
    /**************************************************************************/
    function getSearchResults() {
        var showList = document.querySelectorAll(".show");
        var hideList = document.querySelectorAll(".hide");
        var error = document.getElementById("error");

        hideUnMatchedElements(hideList);

        if (showList.length > 0) {
            error.style.display = "none";
            paginateList(showList);
        }
        else {
            //EXTRA CREDIT
            error.innerHTML = "<b> Sorry no match for "+ key +" was found.</b>";
            error.style.display = "block";
        }
    }

    /**************************************************************************/
    /* hideUnMatchedElements()                                                */
    /* Accepts a list and removes the elements                                */
    /**************************************************************************/
    function hideUnMatchedElements(list) {
        for(var i=0; i<list.length; i++)
            list[i].style.display="none";
    }

    /**************************************************************************/
    /* paginateList()                                                         */
    /* Accepts a list and displays a subset of the list by the current page   */
    /* 10 per page & fades them in for the animation EXTRA CREDIT             */
    /**************************************************************************/
    function paginateList(list) {
        var numPerPage= 10;
        var startIndex = (currentPage * numPerPage) - numPerPage;
        var endIndex = currentPage * numPerPage;

        for(var i=0; i<list.length; i++) {
            if( i >= startIndex && i < endIndex) {
                //EXTRA CREDIT animation
                list[i].classList.add("fadeIn");
                list[i].style.display="block";
            }
            else {
                list[i].style.display="none";
            }
        }
    }
}());
