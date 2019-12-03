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
            agent.agent = LinUCB.createAgentFromData(jsondata);
        }

        function recommend (armContexts, armsToRecommend){
            return agent.agent.recommend(armContexts, armsToRecommend);
        }

        function update (armContexts, recommendedActions, rewards){
            agent.agent.include(armContexts, recommendedActions, rewards);
        }
        createAgent();
        return agent;

    })