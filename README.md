# Midterm Project - Buy/Sell Listings Website

This Buy/Sell listings website is a web application built with Node and Express that allow users to effectively search for listings and communicate with the buyer to purchase them. User functionality when not authenticated includes: Ability to browse and filter all listings by category and price. User functionality when authenticated includes: Ability to browse and filter all listings by category and price, create a new listing, edit a current listing, remove a listing, mark a listing as sold, and users and sellers can communicate via messaging. To put it briefly, Buy/Sell Listings Website is similar to Kijiji

A non-logged in user can:
1. See featured listings on the home page.
2. Filter listings by price.
3. Favorite listing to check up on later
4. Send messages to the user that is selling the item
5. Users can filter by category.

A logged in user can:
1. Add a new listing
2. Edit their listing
3. Remove their added listing
4. Mark items as sold
5. Reply back to the interested buyer

## Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the `npm install` command.
3. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
4. Go to <http://localhost:8080/login/#> in your browser where the # represents a number between 1-6

## Final Product

!["Screenshot of error handling"](https://github.com/Soliloquiy/tweeter/blob/master/docs/error-handling.png)
!["Screenshot of error handling-2"](https://github.com/Soliloquiy/tweeter/blob/master/docs/error-handling-2.png)
!["Screenshot of mobile view"](https://github.com/Soliloquiy/tweeter/blob/master/docs/mobile-view.png)
!["Screenshot of mobile view-2"](https://github.com/Soliloquiy/tweeter/blob/master/docs/mobile-view-2.png)!["Screenshot of tablet-desktop-view"](https://github.com/Soliloquiy/tweeter/blob/master/docs/tablet-desktop-view.png)
!["Screenshot of tablet-desktop-view-2"](https://github.com/Soliloquiy/tweeter/blob/master/docs/tablet-desktop-view-2.png)


## Dependencies
- body-parser: 1.19.0
- chalk 2.4.2
- cookie-session 1.4.0 or above
- dotenv 2.0.0 or above
- ejs 2.6.0 or above
- Express: 4.17.1 or above
- jquery 3.6.0 or above
- moment 2.29.1 or above
- morgan 1.9.1 or above
- Node 5.10.x or above
- node sass-middleware 0.11.0 or above
- pg 8.5.0 or higher
- pg-native 3.0.0 or higher
- router 1.3.5 or above
- nodemon 1.19.1 or above
