# ng-notseo
This example project may be used to demonstrate that Fetch as Google in the Webmaster Tools Search Console does NOT process the javascript to fully render the page nor to update Page Title, Meta Description, and Meta Keywords.

There are many assertions, including at https://weluse.de/blog/angularjs-seo-finally-a-piece-of-cake.html, that claim it is no longer necessary to use the _escaped_fragment_ convention to allow search bots to retrieve fully rendered pages.

Seeing repeated recitations of these assertions has become tiring so I've supplied a (non)working example for anyone to test on their own.

The project is deployed at http://ng-notseo.appspot.com/ for inspection.

Feel free to clone the project, add your own Google Verification document, deploy on your favorite platform and inspect the results of a Fetch and Render in the Search Console.

See FetchAndRenderResults.html for my results.
