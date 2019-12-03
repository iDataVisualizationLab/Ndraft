'use strict';

angular.module('pcagnosticsviz')
  .controller('MainCtrl', function($scope, $document, Spec, Dataset,$location, Wildcards, Config, consts, Chronicle, Logger, Bookmarks, Modals, FilterManager,NotifyingService,PCAplot,RECOMMENDATION,Pills,SpecProfile,$mdToast,$firebaseArray,Auth) {
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
    $scope.recommendation= RECOMMENDATION;
    $scope.SpecProfile= SpecProfile;
    $scope.showEncoding = false;
    $scope.showExtraGuide = false;
    $scope.themeDrak = false;
    $scope.showvideo = true;
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

    //<editor-fold desc=User manager>
      $scope.auth = Auth;
      // // database for preset
      // var auth = $firebaseAuth();
      //
      $scope.islogin =false;
      // any time auth state changes, add the user data to scope
      $scope.auth.firebaseAuthObject.$onAuthStateChanged(function(firebaseUser) {
          // console.log(firebaseUser)
          $scope.islogin = firebaseUser!==null;
          $scope.firebaseUser = firebaseUser;
      });
      //</editor-fold>

      //
      const ref = firebase.database().ref().child('RL');
      ref.on('value', function(snapshot) {
          console.log('LOADED AGENT')
          if(snapshot.val()===null) {
              $scope.recommendation.createAgent()
              ref.set(JSON.stringify($scope.recommendation.getAgent()), function(error) {
                  if (error) {
                      console.log(error)
                  } else {
                      console.log('SUCCESS init agent data')
                  }
              });
          }else{
              $scope.recommendation.setAgent(JSON.parse(snapshot.val()));
          }
      });
      // ref.orderByChild("id").limitToLast(25);
      // let preset = new $firebaseArray(ref);
      // preset.$loaded().then(function(){
      //     $scope.profile = preset.$value;
      // });

      // asume we load the profile from linkn
      $scope.profile = {level:0,age:0,major:0};

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

    $scope.toggleSelectFields = function ($event) {
        switch($event.currentTarget.getAttribute('aria-checked')){
            case 'true':
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Keep a least 2 variable to avoid error!')
                        .position('top right')
                        .hideDelay(2000));
                $event.currentTarget.setAttribute('aria-checked','false');
                $scope.Dataset.schema._fieldSchemas_selected.forEach(f=>f.disable=true); // disabel all
                // $scope.Dataset.schema._fieldSchemas_selected= $scope.Dataset.schema._fieldSchemas_selected.slice(0,2);
                $scope.Dataset.schema._fieldSchemas_selected= [];
                $scope.Dataset.schema._fieldSchemas_selected.forEach(f=>f.disable=false); // enable 2 for avoid error
                $scope.Dataset.schema._fieldSchemaIndex_selected = {};
                $scope.Dataset.schema._fieldSchemas_selected.forEach(d=>$scope.Dataset.schema._fieldSchemaIndex_selected[d.field]=d);
                break;
            case 'false':
                $event.currentTarget.setAttribute('aria-checked','true');
                $scope.Dataset.schema._fieldSchemas.forEach(f=>f.disable=false);
                $scope.Dataset.schema._fieldSchemaIndex_selected = $scope.Dataset.schema._fieldSchemaIndex;
                $scope.Dataset.schema._fieldSchemas_selected = $scope.Dataset.schema._fieldSchemas.slice();
                $scope.Dataset.schema._fieldSchemas_selected.sort((a,b)=>a.index-b.index);
                break;
            default:
                $event.currentTarget.setAttribute('aria-checked','true');
        }
        Pills.fieldchange();
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
    console.log($location.search());

    function initwithURL(urlObject){
        let dataID = urlObject.data;
        if (dataID) {
            try {
                Dataset.dataset = Dataset.datasets.find(d => d.id === dataID)||Dataset.dataset;
            }catch(e){
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Request data fail, use profile link instead of direct link!")
                        .position('top right')
                        .hideDelay(2000));
            }
        }
        Dataset.invalidList = {'':null,'null':null,'undefined':null,'empty':null,' ':null};
        Dataset.update(Dataset.dataset).then(function() {
            Config.updateDataset(Dataset.dataset);
            if (consts.initialSpec) {
                Spec.parseSpec(consts.initialSpec);
                PCAplot.parseSpec(consts.initialSpec);
            }
            // PCAplot.plot(Dataset.data);
            //Biplot.data = Dataset.data;
            $scope.chron = Chronicle.record('Spec.spec', $scope, true,
                ['Dataset.dataset', 'Config.config', 'FilterManager.filterIndex','PCAplot.prop.fieldDefs','PCAplot.prop.pos','PCAplot.prop.dim','PCAplot.prop.type','PCAplot.prop.mark']);
            // $scope.chron = Chronicle.record(['PCAplot.prop.mspec','PCAplot.prop.type','PCAplot.prop.dim','PCAplot.prop.pos'], $scope, true,
            //      ['Dataset.dataset', 'Config.config', 'FilterManager.filterIndex','Spec.spec']);
            $scope.canUndoRedo = function() {
                $scope.canUndo = $scope.chron.canUndo();
                $scope.canRedo = $scope.chron.canRedo();
            };
            $scope.chron.addOnAdjustFunction($scope.canUndoRedo);
            $scope.chron.addOnUndoFunction($scope.canUndoRedo);
            $scope.chron.addOnRedoFunction($scope.canUndoRedo);

            $scope.chron.addOnUndoFunction(function() {
                Logger.logInteraction(Logger.actions.UNDO);
                PCAplot.updateSpec(PCAplot.prop);
            });
            $scope.chron.addOnRedoFunction(function() {
                Logger.logInteraction(Logger.actions.REDO);
                PCAplot.updateSpec(PCAplot.prop);
            });

            $scope.choseByClick = function ($event) {
                d3v4.select($event.currentTarget).select('.command.select.ng-scope').dispatch('click');
                // d3v4.select(this).select('.command.select.ng-scope').dispatch('click');
            };
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
    }


    $scope.getURL = function(){
        /* Get the text field */
        var copyText = $scope.PCAplot.getURL();

        const el = document.createElement('textarea');
        el.value = copyText;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        /* Alert the copied text */
        $mdToast.show(
            $mdToast.simple()
                .textContent("Copied the url: " + copyText)
                .position('top right')
                .hideDelay(1000));
    }

      // $scope.$watch(function(){
      //     return ((Dataset.schema||{})._fieldSchemas_selected||[]).map(d=>d.field);
      // },function(newmspec){
      //    console.log('chaging....');
      //    console.log(newmspec);
      // },true);

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

      initwithURL($location.search())
  });
