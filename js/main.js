(function() {
  'use strict';

  angular.module('app', ['ui.router'])
  .config(config)
  .constant('taskContentArray', taskContentArray)
  .service('staticService', staticService)
  .controller('ConclusionCtrl', ConclusionCtrl)
  .controller('PageCtrl', PageCtrl)

  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {

  	$stateProvider
  	  .state('contents', {
  	    url: '/contents',
  	    templateUrl: 'contents.html',
  	    controller: function($scope, $state) {
  	      var self = this;
  	      
  	      $scope.startApp = function() {
  	        $state.go('page', {path: 1});
  	      }
  	    }
  	  })
  		.state('page', {
  		  url: '/page/:path',
        views: {
          'header': {
            templateUrl: 'header.html',
            controller: function($scope, $stateParams, staticService) {
                $scope.navShow = true;
                $scope.pageNum = Number($stateParams.path);
                $scope.pageAmount = staticService.getObj().length;
            }        
          },
          'content': {
            templateUrl: 'page.html',
            controller: 'PageCtrl'
          }
        }
      })
      .state('conclusion', {
  	    url: '/conclusion',
  	    views: {
          'header': {
            templateUrl: 'header.html',
            controller: function($scope, $stateParams, staticService) {
                $scope.navShow = false;
                $scope.pageNum = Number($stateParams.path);
                $scope.pageAmount = staticService.getObj().length;
            }   
          },
          'content': {
            templateUrl: 'conclusion.html',
            controller: 'ConclusionCtrl'
          }
        }
  	  })

    $urlRouterProvider.otherwise('/contents');
  };

  /* @ngInject */
  function staticService() {    
    this.getObj = function() {
      return taskContentArray;
    }
  }

  /* @ngInject */
  function ConclusionCtrl($scope, $interval) {
    function setDate() {
    	const now = new Date();
    	const future = new Date(2017, 2, 7, 15, 0, 0);
    	const diff = future - now;
    	if (diff > 0) {
      	$scope.hours = Math.floor(diff / 1000 / 3600);
      	$scope.minutes = Math.floor((diff - $scope.hours * 1000 * 3600) / 1000 / 60);
      	$scope.seconds = Math.floor((diff - $scope.hours * 1000 * 3600 - $scope.minutes * 1000 * 60) / 1000);
    	} else {
    	  $scope.hours = 0;
    	  $scope.minutes = 0;
    	  $scope.seconds = 0;
    	}
    };
    
    $interval(setDate, 1000);
  };

  /* @ngInject */
  function PageCtrl($scope, $timeout, $state, $stateParams, staticService) {
    var currentPageNum = Number($stateParams.path),
        taskObj = staticService.getObj();
        
    $scope.show = false;
    
    $scope.pageNum = currentPageNum;
   
    $scope.taskImg = taskObj[currentPageNum - 1].src;
    
    $scope.altImg = taskObj[currentPageNum - 1].alt;
    
    $scope.question = taskObj[currentPageNum - 1].question;
    
    $scope.variants = taskObj[currentPageNum - 1].variants;
    
    $scope.rightAns = taskObj[currentPageNum - 1].rightAns;
    
    $scope.commentText = taskObj[currentPageNum - 1].content;

    $scope.checkIt = function($event) {
      $scope.taskImg = taskObj[currentPageNum - 1].newSrc;
      $scope.altImg = taskObj[currentPageNum - 1].newAlt;
      
      if (Number($($event.currentTarget).attr('data-order')) === $scope.rightAns) {
        $scope.isCorrect = true;
        $scope.commentTitle = 'Верно!';
      } else {
        $scope.isCorrect = false;
        $scope.commentTitle = 'Правильный ответ';
      }
      $timeout(function() {
        $scope.show = !$scope.show;
      }, 200);
    }
   
   $scope.toNext = function() {
     if (currentPageNum === taskObj.length) {
       $state.go('conclusion')
     } else {
       $state.go('page', {path: Number($stateParams.path) + 1 });
     }
   }
  }
})();