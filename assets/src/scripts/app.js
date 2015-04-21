(function() {
	// Define our app and list of additional modules
	var app = angular.module('AngularApp', ['ngResource', 'customFilters']);

	// Main news controller
	app.controller('NewsController', function($scope, $resource, News) {
		// Check if the page is currently in a loading state
		$scope.isLoading = false;

		// Hold the list of news to render
		$scope.news = [];

		// Define the JSONP oriented resourse with "JSON_CALLBACK" string param
		var resource = $resource(
			"http://pipes.yahoo.com/pipes/pipe.run?_id=DqsF_ZG72xGLbes9l7okhQ&_render=json&_callback=JSON_CALLBACK",
			{
				callback: "JSON_CALLBACK"
			},
			{
				getNews: {
					method: "jsonp"
				}
			}
		);

		// Get the list of news
		loadRemoteData();

		// Re-request the data from the server (using JSONP)
		$scope.refresh = function() {
			loadRemoteData();
		};

		// Load the remote data using resource service
		function loadRemoteData() {
			$scope.isLoading = true;

			resource.getNews().$promise.then(
				function(data) {
					$scope.isLoading = false;
					$scope.news = data.value.items;
				},
				function(error) {
					alert("Something went wrong!");
				}
			);
		}

		// Set the article to show in modal usign News factory method
		$scope.setArticle = function(key) {
			News.setArticle($scope.news[key]);
		};
	});

	// Modal article controller
	app.controller('ArticleController', function($scope, News) {
		$scope.$on('valuesUpdated', function() {
			$scope.article = News.getArticle();
		});
	});

	// Pass data between the two controllers using a factory
	app.factory('News', function ($rootScope) {
		var article = {};

		return {
			getArticle: function () {
				return article;
			},
			setArticle: function(value) {
				article = value;
				$rootScope.$broadcast("valuesUpdated");
			}
		};
	});

	// Create custom filter to strip html tags
	angular.module('customFilters', []).
		filter('htmlToText', function() {
			return function(text) {
				return String(text).replace(/<[^>]+>/gm, '');
			};
		});
})();