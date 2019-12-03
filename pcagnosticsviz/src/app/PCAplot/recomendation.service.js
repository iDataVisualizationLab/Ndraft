'use strict';

angular.module('pcagnosticsviz')
    .factory('RECOMMENDATION', function(){
        let agent ={
            agent: undefined,
            createAgent: createAgent,
            getAgent: getAgent,
            setAgent: setAgent,
            recommend: recommend,
            update: update,
        };

        function createAgent(){
            agent.agent = new LinUCB(1, 36, 19);
        }

        function getAgent(){
            return agent.agent.getAgentData();
        }

        function setAgent(jsondata){
            agent.agent = LinUCB.createAgentFromJSONString(jsondata);
        }

        function recommend (armContexts, armsToRecommend){
            return agent.agent.recommend(armContexts, armsToRecommend);
        }

        function update (armContexts, recommendedActions, rewards){
            agent.agent.include(armContexts, recommendedActions, rewards);
            firebase.database().ref().child('RL').set(JSON.stringify(agent.getAgent()), function(error) {
                if (error) {
                    console.log(error)
                } else {
                    console.log('SUCCESS init agent data')
                }
            });
        }
        createAgent();
        return agent;

    })