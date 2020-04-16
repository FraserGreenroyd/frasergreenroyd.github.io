app.controller('indexController', function($scope, $window, $http, $filter, notificationFactory, failureHandling, $location, apiHelpers) {

	$scope.isLoading = true;

	//Navigation objects
	$scope.navigationObjectModel = [];
	$scope.navigationEngines = [];
	$scope.navigationAdapters = [];

	$scope.expandObjects = false;
	$scope.expandEngine = false;
	$scope.expandAdapter = false;

	$scope.objects = [];
	$scope.methods = [];
	$scope.adapters = [];

	$scope.mainSearch = {
		searchTerm : "",
	};

	$scope.handleFailure = function(response)
	{
		$scope.isLoading = false;
		failureHandling.handleFailure(response, $window);
	};

	$scope.showObjects = function()
	{
		$scope.expandObjects = !$scope.expandObjects;
	};

	$scope.showEngine = function()
	{
		$scope.expandEngine = !$scope.expandEngine;
	};

	$scope.showAdapter = function()
	{
		$scope.expandAdapter = !$scope.expandAdapter;
	};

	$scope.goToObjectNamespace = function(namespace)
	{
		$window.location.href = "object.html#!?namespace=" + namespace;
	};

	$scope.goToEngineNamespace = function(engine)
	{
		$window.location.href = "engine.html#!?engine=" + engine;
	};

	$scope.goToAdapterNamespace = function(adapter)
	{
		alert("Not done, sorry");
	};

	$scope.surpriseMe = function()
	{
		var random = (Math.random() * 10);
		if(random > 5)
		{
			//Randomly for an engine
			var item = $scope.methods[Math.floor(Math.random() * $scope.methods.length)];
			$window.location.href = "engine.html#!?engine=" + item.namespace + "&method=" item.memberName;
		}
		else
		{
			//Randomly for an object
			var item = $scope.objects[Math.floor(Math.random() * $scope.objects.length)];
			$window.location.href = "object.html#!?namespace=" + item.namespace + "&object=" + item.memberName;
		}
	};

	$scope.displayNamespaceSplit = function(namespace)
	{
		var split = namespace.split('.');

		if(split.length > 2)
		{
			if(split.length > 3 && split[2] == "External")
				return split[3];
			else
				return split[2];
		}
		else return namespace; //Not sure what happened
	};

	$scope.$on('$locationChangeSuccess', function (a, newUrl, oldUrl) {
		$scope.isLoading = true;

		$scope.setUpNavigation();
	});

	$scope.setUpNavigation = function()
	{
		$http.get('js/adapter.json').then(function(response) {
			$scope.adapters = response.data;

			$scope.adapters.forEach(function(obj) {
				var ns = obj.namespace;
				if(apiHelpers.nthIndexOf(ns, '.', 3) != -1)
					ns = ns.substring(0, apiHelpers.nthIndexOf(ns, '.', 3));

				if($scope.navigationAdapters.indexOf(ns) == -1)
					$scope.navigationAdapters.push(ns);
			});

			$scope.navigationAdapters.sort();

			$http.get('js/methods.json').then(function(response) {
				$scope.methods = response.data;

				$scope.methods.forEach(function(obj) {
					var ns = obj.namespace;
					if(apiHelpers.nthIndexOf(ns, '.', 3) != -1)
						ns = ns.substring(0, apiHelpers.nthIndexOf(ns, '.', 3));

					if($scope.navigationEngines.indexOf(ns) == -1)
						$scope.navigationEngines.push(ns);
				});

				$scope.navigationEngines.sort();

				$http.get('js/objects.json').then(function(response) {
					$scope.objects = response.data;

					$scope.objects.forEach(function(obj) {
						var ns = obj.namespace;
						if(apiHelpers.nthIndexOf(ns, '.', 3) != -1)
							ns = ns.substring(0, apiHelpers.nthIndexOf(ns, '.', 3));

						if($scope.navigationObjectModel.indexOf(ns) == -1)
							$scope.navigationObjectModel.push(ns);
					});

					$scope.navigationObjectModel.sort();

					$scope.read_Engine();
				}, function(response) {
					$scope.handleFailure(response);
				});
			}, function(response) {
				$scope.handleFailure(response);
			});
		}, function(response) {
			$scope.handleFailure(response);
		});
	};

	$scope.runSearch = function()
	{
		
	};
});