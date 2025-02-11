/* 
*
*    DRINK FUNCTIONS BACKUP in drinks.js - Not In Use after 17 Dec 2024
*
*/

		/*    PRE_LOAD FUNCTIONS : CALLED BY OLD HEADER.PHP    
				////    ////    ////    ////    ////     */

		/*
					MODIFIES <div="wp-site-blocks".style.backgroundImage using 
					scoped pageID
				*/
		function ucInsertBackground(){

					let anPage = document.querySelector("body");

					/*  
					
					*/
					
					/* WORKS with single quotes in CSS URL variables!! &&
						ALSO with String.concat() NOT string += approach 
					*/
					let bgVar = 'var(--';
					//bgVar.concat('var(--');
					bgVar = bgVar.concat(pageID);
					bgVar = bgVar.concat("-bg-img)");
						//	console.log(bgVar);  
					
					//anPage[0].style.backgroundImage = "var(--romantic-bg-img)";

					anPage.style.backgroundImage =  bgVar  ;
					//document.body.style.background = bgVar;
					//console.log(anPage);

		}

		function ucColorH1(){

					//console.log("test again");

					var highlight = 'var(--';
					highlight = highlight.concat(pageID);
					highlight = highlight.concat("-shadow)");

					//console.log(highlight);

					//document.getElementsByTagName("h1")[0].style.textShadow = highlight;

					//console.log(document.querySelectorAll("h1"));

					var headings = document.querySelectorAll("h1");

					// Where more than one h1 exists...
					for (let i = 0; i < headings.length; i++){

						headings[i].style.textShadow = highlight; 

						// Work around an_gallery slug being weird. 
						if(pageID.includes("gallery")){

							headings[i].style.textShadow = "var(--std-text-shadow)";

						}

						if(pageID.includes("fireplace")){

							//headings[i].style.color = "#b6b6b6";


						}



					}

					//console.log(headings);


		}



		        ////    ////    ////    ////     ////
		/*    PRE_LOAD FUNCTIONS : CALLED BY OLD HEADER.PHP    */



		/*    MISC. HELPER FUNCTIONS    
		    ////    ////    ////    ////    */ 
			
			//  Add CSS class to figure based on dimensions of img (on load) 
			//  Repurposed from Drink.ucConvertDrinkToFigure(), to Be Used Everywhere. 
			function ucPortraitLandscape(anImage, anFigure){
				let drinkImage = anImage;
				let figure = anFigure;	
				//console.log('Image src:', drinkImage.src);
				
				//console.log('Image complete:', drinkImage.complete);		
				if (drinkImage.complete) {
					// Image is already loaded, process immediately
					//console.log(drinkImage.naturalHeight);
					//console.log(drinkImage.naturalWidth);
					processImageDimensions();
				} else {
					// Image is not loaded yet, wait for load event
					drinkImage.onload = processImageDimensions;
				}
						
				function processImageDimensions() {
					//console.log(drinkImage.naturalHeight);
					//console.log(drinkImage.naturalWidth);
					if(drinkImage.naturalHeight > drinkImage.naturalWidth){
						figure.classList.add("portrait");
						//console.log("portrait");

					} else if (drinkImage.naturalHeight < drinkImage.naturalWidth){
						figure.classList.add("landscape");
						//console.log("landscape");
					} 
				}

			}
			document.addEventListener("DOMContentLoaded", (event) => {
				// Query Selector to affect Gallery Pages' Query Body only. 
				document.querySelectorAll('.wp-block-post-featured-image').forEach(figure => {
					ucPortraitLandscape(figure.querySelector('img'), figure);
				});
			});


			/*
				Remove 3 digits of anString 

				modifies original string
				*/

			function ucRemovePrefix(anString){ 
					/*ACCEPTS tags[i] in .pop-off, column constructing for loop above*/

					let ucStr = Array.from(anString);
					//console.log(ucStr);
					//console.log("Arr");

					/*quick fix*/ 
					ucStr.shift();
					ucStr.shift(); ucStr.shift();

					
					/*	join() excludes commas from array, unlike .toString()	*/
					anString = ucStr.join("");
					//console.log(anString);
					//console.log("final");



					return anString;
			}





			/*	Repurposed from NavBar to Generic for Carousel, etc.  */
			function showHide(lmnt) {
				const element = document.querySelector(lmnt);
				console.log(element);
				if (element) {
					if (element.style.display === "none") {


						element.style.display = "block";
					} else {
						element.style.display = "none";
					}
				}
			}


			function ucAjaxCarousel(e){

				//console.log(e.target)
				e.preventDefault(); //Stop page refresh

				let searchValue = '';

				// Check if event target is an image
				if (e.target.tagName === 'IMG') {
					// Find the closest parent with .post & .post-#### class
					const postElement = e.target.closest('.post[class*="post-"]');
					if (postElement) {
						// Get the post title from within this element
						searchValue = postElement.querySelector('.wp-block-post-title')?.textContent || 'Title not found';

					}
				}
				// Check if event target is a button
				else if (e.target.tagName === 'BUTTON') {
					// Get search term from button's parent element
					searchValue = e.target.closest('.search-container')?.querySelector('input')?.value || '';
				}
				

				//  Make AJAX call to WordPress
					fetch(`${window.location.origin}/wordpress/wp-admin/admin-ajax.php`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: `action=filter_carousel&search_term=${encodeURIComponent(searchValue)}`
					})
					.then(response => response.text())
					.then(html => {
						// Update the carousel with the new HTML
						const carousel = document.querySelector('.uc-swiper-list');
						if (carousel) {
							carousel.innerHTML = html;
						}
						console.log(carousel);

						// Apply portrait/landscape classes to new figures
						carousel.querySelectorAll('figure').forEach(figure => {
							ucPortraitLandscape(figure.querySelector('img'), figure);
						});
						document.querySelector('.uc-slideshow').classList.toggle("hidden");
					})
					.catch(error => console.error('Error:', error));
				
			}



			// Apply Click Evt Lstnr to an Array of Figures
			function ucListenIteratively(anyFigureArray){  //  Repurposed to use AJAX & functions.php uc_filter_carousel

				for(const figure of anyFigureArray){
					const nodes = figure.childNodes;
					nodes.forEach(element => {
					//console.log(element);
							element.addEventListener("click", 
								(e) => {	
									

									ucAjaxCarousel(e);
							
									

								
								})	}
						);	};


							
			}

			//
			window.addEventListener("load", (event) => {
				// ... existing load event code ...
				
				/* const toggleButton = document.querySelector('.toggle-button');
				if (toggleButton) {
					toggleButton.addEventListener('click', () => {
						showHide('.uc-slideshow'); //Does styling inline
					});
				} */

				const allFigures = document.querySelectorAll(".portrait, .landscape");
				if(allFigures.length > 0){
					ucListenIteratively(allFigures);
				}

				
				document.querySelector(".wp-block-search__button").addEventListener("click", (e) => {
					ucAjaxCarousel(e);
				});
				
			}); 
				











			/*    ucRemoveMenuItem filters current page off navbar...	*/
			function ucRemoveMenuItem(){
				
					var thisPage = document.getElementsByTagName("title")[0].innerText;
					//console.log(thisPage);
					var thesePages = document.getElementById("tierOne");
					thesePages = Array.from(thesePages.children);
					
					for (let i = 0; i < thesePages.length; i++){
						
						let currentPage =  thesePages[i].innerText;
						//console.log(currentPage);
				
						/* FIXED BELOW if(currentPage == thisPage){ */
						if(thisPage.includes(currentPage)){   
							
							thesePages[i].setAttribute("id", "hidden"); /*EFFECTIVE*/
							//console.log("IF Succeeded");
							/*console.log(thesePages[i]);*/
					
				
						}
					}
					//console.log(thisPage);
					//console.log(thesePages);
	
			}


			/*  Accepts .querySelector type DOM item, 
			*   Returns height in px of tallest child item, Recursion style
			*   Called By welcome-carousel.php pattern <script insert 
			*/
			function findTallestChild(node) {
			
			 
				let maxHeight = 0;
			  
				function traverse(node) {
				  const childHeight = node.offsetHeight; // or node.clientHeight
				  if (childHeight > maxHeight) maxHeight = childHeight;
			  
				  if (node.children.length === 0) return maxHeight; // leaf node, return height
				  /* node.children.forEach was not a function (NOT due queryselector, not sure why  */
				  Array.from(node.children).forEach((child) => traverse(child));
				}
			  
			
					traverse(node);
					return maxHeight;
	
				
			}  /* END findTallestChild */

	
	
	
			////    ////    ////    //// 
		/*    MISC. HELPER FUNCTIONS    */




	/*    SEARCH & FILTER FUNCTIONS    
        ////    ////    ////    ////    */
								
	




	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	  }

		   ////    ////    ////    ////
	/*    SEARCH & FILTER FUNCTIONS    */
 





    /* 
	*    Customize WP Header
	*/
    function ucCustomizeWPHeader(){

		

		const theLogo = `<div class="wp-block-site-logo uc-extra-logo"><a href="http://localhost/wordpress/" class="custom-logo-link" rel="home"><img width="512" height="512" src="http://localhost/wordpress/wp-content/uploads/2024/12/logo512x.jpg" class="custom-logo" alt="Untouched Cocktails" decoding="async" fetchpriority="high" srcset="http://localhost/wordpress/wp-content/uploads/2024/12/logo512x.jpg 512w, http://localhost/wordpress/wp-content/uploads/2024/12/logo512x-300x300.jpg 300w, http://localhost/wordpress/wp-content/uploads/2024/12/logo512x-150x150.jpg 150w" sizes="(max-width: 512px) 100vw, 512px" data-attachment-id="2684" data-permalink="http://localhost/wordpress/logo512x/" data-orig-file="http://localhost/wordpress/wp-content/uploads/2024/12/logo512x.jpg" data-orig-size="512,512" data-comments-opened="1" data-image-meta="{&quot;aperture&quot;:&quot;0&quot;,&quot;credit&quot;:&quot;&quot;,&quot;camera&quot;:&quot;&quot;,&quot;caption&quot;:&quot;&quot;,&quot;created_timestamp&quot;:&quot;0&quot;,&quot;copyright&quot;:&quot;&quot;,&quot;focal_length&quot;:&quot;0&quot;,&quot;iso&quot;:&quot;0&quot;,&quot;shutter_speed&quot;:&quot;0&quot;,&quot;title&quot;:&quot;&quot;,&quot;orientation&quot;:&quot;1&quot;}" data-image-title="logo512x" data-image-description="" data-image-caption="" data-medium-file="http://localhost/wordpress/wp-content/uploads/2024/12/logo512x-300x300.jpg" data-large-file="http://localhost/wordpress/wp-content/uploads/2024/12/logo512x.jpg"></a></div>`;

		const mobileNav = document.querySelector(".wp-block-navigation");

		// Function to handle orientation changes
		function handleOrientation(mediaQuery) {
			if (!mediaQuery.matches) { // Portrait mode
				// Check if logo already exists to prevent duplicates
				if (!mobileNav.querySelector('.uc-extra-logo')) {
					mobileNav.insertAdjacentHTML('afterbegin', theLogo);
				}
			} else { // Landscape mode
				const extraLogo = mobileNav.querySelector('.uc-extra-logo');
				if (extraLogo) {
					extraLogo.remove();
				}
			}
		}

		// Create media query for landscape orientation
		const landscapeQuery = window.matchMedia("(orientation: landscape)");
		
		// Initial check
		handleOrientation(landscapeQuery);
		
		// Add listener for orientation changes
		landscapeQuery.addEventListener('change', handleOrientation);

		const links = Array.from(document.querySelectorAll(".wp-block-navigation-link"));
		//console.log(links);

		// Array of seasonal cocktail names to match
		const seasonalNames = [
			"Summertime Cocktails",
			"Aurumnal Cocktails",
			"Springtime Cocktails",
			"Wintertime Cocktails"
		];

		// Find indexes of links containing any seasonal cocktail name
		const matchingIndexes = links.reduce((acc, link, index) => {
			if (seasonalNames.some(name => link.textContent.includes(name))) {
				acc.push(index);
			}
			return acc;
		}, []);

		// Replace the .innerText of the links at the indexes with "Seasonal Cocktails"
		matchingIndexes.forEach(index => {
			links[index].innerText = "Seasonal Cocktails";
		});

		//console.log("Indexes of seasonal cocktail links:", matchingIndexes);

		
 	}









/*    ACTIONS : WHERE THE FUNCTIONS ARE CALLED     */
    ////    ////    ////    ////
       ////    ////    ////    ////
/*    ACTIONS : WHERE THE FUNCTIONS ARE CALLED     */
	
		/*		...WHEN PAGE LOADS... 		*/
		/* document.addEventListener("DOMContentLoaded", (event) =>{ */
		window.addEventListener("load", (event) =>{
			//console.log("Resources Loaded");
			

			/*  ON EVERY PAGE...  */
			ucInsertBackground();
			ucCustomizeWPHeader();
			//ucAddPaginationLeftArrowToCarousel();


			/*    On Contact Page, Handle Form?  */
			if(pageID.includes("contact")===true){
				//TRYING to prevent auto page refresh

				//Get form element
				var form=document.getElementById("contact-form");
				//console.log(form);

				function submitForm(event){
				
				//Preventing page refresh
			//	event.preventDefault();
				}

			
				//Calling a function during form submission.
				form.addEventListener('submit', submitForm);
			


			}
			

			if(pageID.includes("home")){ //Show/Hide carousel on home page Only 
				const carousel = document.querySelector('.welcome-carousel');
				
				// Function to handle orientation changes
				function handleOrientation(mediaQuery) {
					if (mediaQuery.matches) {
						// Landscape mode
						carousel.style.display = 'none';
					} else {
						// Portrait mode
						carousel.style.display = 'block';
					}
				}
			
				// Create media query for landscape orientation
				const landscapeQuery = window.matchMedia("(orientation: landscape)");
				
				// Initial check
				handleOrientation(landscapeQuery);
				
				// Add listener for orientation changes
				landscapeQuery.addEventListener('change', handleOrientation);
			}

			/* if(document.querySelector('.carousel')){ //great 
				resizeCarousel();
			} */

			
			
		});
