(function() {
	var app = angular.module('NewsApp', ['ngResource', 'customFilters']);

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
				newsData: {
					method: "jsonp"
				}
			}
		);

		// Get the list of news
		getLatestNews();

		// Re-request the data from the server
		$scope.refresh = function() {
			getLatestNews();
		};

		// Load the remote data using resource service
		function getLatestNews() {
			$scope.isLoading = true;

			resource.newsData().$promise.then(
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