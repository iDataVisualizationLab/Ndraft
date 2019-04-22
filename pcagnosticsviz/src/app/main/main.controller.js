'use strict';

angular.module('pcagnosticsviz')
  .controller('MainCtrl', function($scope, $document, Spec, Dataset, Wildcards,  Config, consts, Chronicle, Logger, Bookmarks, Modals, FilterManager,NotifyingService,PCAplot) {
    $scope.Spec = Spec;
    $scope.contain = {"bi-plot":'Overview',
        "div":[{key:'guideplot',val:'Exemplar'},
            {key:'thumplot',val:'Feature pannel'},
            {key:'slideGraph',val:'Mainview view'},
            {key:'alternatives-pane',val:'Expanded views'},
            {key:'guidemenu',val:'Feature pannel'}],
        'h3':'headertext',
        "body":'body'};
    $scope.Dataset = Dataset;
    $scope.Wildcards = Wildcards;
    $scope.Config = Config;
    $scope.Logger = Logger;
    $scope.Bookmarks = Bookmarks;
    $scope.FilterManager = FilterManager;
    $scope.consts = consts;
    $scope.showDevPanel = false;
    $scope.embedded = !!consts.embeddedData;
    //  $scope.Biplot = Biplot;
    $scope.hideExplore = false;
    $scope.fieldShow = true;
    $scope.WildcardsShow = false;
    $scope.PCAplot= PCAplot;
    $scope.showEncoding = false;
    $scope.showExtraGuide = false;
    $scope.themeDrak = false;
      $scope.fieldAdd = function(fieldDef) {
          Pills.add(fieldDef);
      };
    $scope.toggleHideExplore = function() {
      $scope.hideExplore = !$scope.hideExplore;
      if ($scope.hideExplore) {
        Logger.logInteraction(Logger.actions.TOGGLE_HIDE_ALTERNATIVES, Spec.chart.shorthand);
      } else {
        Logger.logInteraction(Logger.actions.TOGGLE_SHOW_ALTERNATIVES, Spec.chart.shorthand);
      }
    };

    $scope.alternativeType = null;
    $scope.setAlternativeType = function(type, automatic) {
      $scope.alternativeType = type;
      if (!automatic) {
        $scope.hideExplore = false;
        Logger.logInteraction(Logger.actions.TOGGLE_SHOW_ALTERNATIVES, Spec.chart.shorthand);
        Logger.logInteraction(Logger.actions.SET_ALTERNATIVES_TYPE, type, {
          shorthand: Spec.chart.shorthand
        });
      }
    };


    // log event
  $scope.onMouseOverLog = function ($event) {
      var regionAction =undefined;
      $event.originalEvent.path.find(function(d) {
          if (d.tagName.toLowerCase()=='div') {
              var temp = $scope.contain['div'].find(function(c){return d.classList.contains(c.key)});
              regionAction = (temp==undefined)?undefined:temp.val;
              return temp;
          }
          else{
              regionAction = $scope.contain[d.tagName.toLowerCase()];
                return regionAction;
          }});
      if (regionAction!='body')
          Logger.logInteraction(Logger.actions.MOUSE_OVER,regionAction, {val:{region:regionAction,
                  position: {screenX:$event.screenX,
                      screenY: $event.screenY,}},time:new Date()});
  };
     // end log
    $scope.scrollToTop = function() {
      $document.find('.vis-pane-container').scrollTop(0);
    };

    $scope.groupByChanged = function() {
      Logger.logInteraction(Logger.actions.GROUP_BY_CHANGED, Spec.spec.groupBy);
    };
    $scope.autoAddCountChanged = function() {
      Logger.logInteraction(Logger.actions.AUTO_ADD_COUNT_CHANGED, Spec.spec.autoAddCount);
    };

    $scope.$watch('Spec.alternatives', function(alternatives) {
      for (var i = 0 ; i < alternatives.length; i++) {
        if ($scope.alternativeType === alternatives[i].type) {
          return;
        }
      }
      // at this point we don't have the suggestion type available, thus reset
      $scope.setAlternativeType(null, true);
    });

      $scope.$watch(function(){
          return PCAplot.mspec;
      },function(newmspec){
         console.log('logging....');
         console.log(newmspec);
      });

    // undo/redo support
    $scope.canUndo = false;
    $scope.canRedo = false;

    // bookmark
    $scope.showModal = function(modalId) {
      Modals.open(modalId);
      if (modalId == 'bookmark-list') {
        Logger.logInteraction(Logger.actions.BOOKMARK_OPEN);
      }
    };

    $scope.changetheme = function(){
        $scope.themeDrak = !$scope.themeDrak;
    };

    if (Bookmarks.isSupported) {
      // load bookmarks from local storage
      Bookmarks.load();
    }

    if ($scope.embedded) {
      // use provided data and we will hide the dataset selector
      Dataset.dataset = {
        values: consts.embeddedData,
        name: 'embedded'
      };
    }

      NotifyingService.subscribe($scope, function somethingChanged() {
          //console.log("her");
          $scope.$apply();
      });

    // initialize undo after we have a dataset
    Dataset.update(Dataset.dataset).then(function() {
      Config.updateDataset(Dataset.dataset);
      if (consts.initialSpec) {
          Spec.parseSpec(consts.initialSpec);
          PCAplot.parseSpec(consts.initialSpec);
      }
      // PCAplot.plot(Dataset.data);
      //Biplot.data = Dataset.data;
      $scope.chron = Chronicle.record('Spec.spec', $scope, true,
        ['Dataset.dataset', 'Config.config', 'FilterManager.filterIndex']);
      // $scope.chron = Chronicle.record('PCAplot.spec', $scope, true,
      //      ['Dataset.dataset', 'Config.config', 'FilterManager.filterIndex']);
      $scope.canUndoRedo = function() {
        $scope.canUndo = $scope.chron.canUndo();
        $scope.canRedo = $scope.chron.canRedo();
      };
      $scope.chron.addOnAdjustFunction($scope.canUndoRedo);
      $scope.chron.addOnUndoFunction($scope.canUndoRedo);
      $scope.chron.addOnRedoFunction($scope.canUndoRedo);

      $scope.chron.addOnUndoFunction(function() {
        Logger.logInteraction(Logger.actions.UNDO);
      });
      $scope.chron.addOnRedoFunction(function() {
        Logger.logInteraction(Logger.actions.REDO);
      });

      angular.element($document).on('keydown', function(e) {
        if (e.keyCode === 'Z'.charCodeAt(0) && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
          $scope.chron.undo();
          $scope.$digest();
          return false;
        } else if (e.keyCode === 'Y'.charCodeAt(0) && (e.ctrlKey || e.metaKey)) {
          $scope.chron.redo();
          $scope.$digest();
          return false;
        } else if (e.keyCode === 'Z'.charCodeAt(0) && (e.ctrlKey || e.metaKey) && e.shiftKey) {
          $scope.chron.redo();
          $scope.$digest();
          return false;
        }
      });
    });
  });
