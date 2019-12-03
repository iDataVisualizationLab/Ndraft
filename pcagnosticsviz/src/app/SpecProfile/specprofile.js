angular.module('pcagnosticsviz')
    .service('SpecProfile',['Dataset', function(Dataset) {
        var SpecProfile = {
            mainUrl: 'https://idatavisualizationlab.github.io/HMaViz/demo.html#!?',
            // Functions
            /** Get query */
            get: get,

            getUrl: getUrl,
            getUrlbyProp: getUrlbyProp,
            /** Set query */
            set: set,
            setID:setID,

            /** Remove query */
            remove: remove,


            recordsIndex:{},
            records:[],

            /** Listener  */
            listener: null
        };
        let tempId = 0;
        // Add listener type that Pills just pass arguments to its listener
        // FIXME: properly implement listener pattern
        [
        'add', 'update', 'reset'
        ].forEach(function(listenerType) {
            SpecProfile[listenerType] = function() {
                if (SpecProfile.listener && SpecProfile.listener[listenerType]) {
                    return SpecProfile.listener[listenerType].apply(null, arguments);
                }
            };
        });

        function add(prop) {
            const profiel = {
                id: 'n_'+tempId,
                field: prop.fieldDefs.map(f=>f.field),
                type: prop.type,
                mark: prop.mark,
            };
            tempId++;
            SpecProfile.recordsIndex[profiel.id] = profiel;
            SpecProfile.records.push(profiel);

            if (update && SpecProfile.listener) {
                SpecProfile.listener.add(profiel.id, profiel);
            }
        }

        function setID(profileId_old, profileID_new) {
            if (profileId_old !== profileID_new) {
                Object.defineProperty(SpecProfile.recordsIndex, profileID_new,
                    Object.getOwnPropertyDescriptor(SpecProfile.recordsIndex, profileId_old));
                delete SpecProfile.recordsIndex[profileId_old];
            }
        }

        function set(profileId, prop) {
            const profiel = SpecProfile.recordsIndex[profileId];
            profiel.field = prop.fieldDefs.map(f=>f.index);
            profiel.type = prop.type;
            profiel.mark = prop.mark;
            profiel.data = _.omit(Dataset.currentDataset,'values');
            profiel.fieldSetting = Dataset.schema._fieldSchemas_selected.map(f=>f.index);

            if (SpecProfile.listener) {
                SpecProfile.listener.set(profileId, profiel);
            }
        }

        /** Get query */
        function get(profileId) {
            if (profileId===undefined)
                return SpecProfile.records;
            return SpecProfile.recordsIndex[profileId];
        }

        function getUrl(profileId) {
            return SpecProfile.mainUrl+'profile='+profileId;
        }

        // may not use
        function getUrlbyProp(prop) {
            const profiel = {
                field: prop.fieldDefs.map(f=>f.index),
                type: prop.type,
                mark: prop.mark,
                data: _.omit(Dataset.currentDataset,'values'),
                fieldSetting: Dataset.schema._fieldSchemas_selected.map(f=>f.index)
            };
            let urlString = SpecProfile.mainUrl;
            urlString+='field='+profiel.field.join(',');
            urlString+='&type='+profiel.type;
            urlString+='&mark='+profiel.mark;
            if(profiel.data.group==='pasted')
                urlString+='&data='+profiel.data.name;
            else
                urlString+='&data='+profiel.data.id;
            urlString+='&fieldSetting='+profiel.fieldSetting.join(',');
            return urlString;
        }

        function remove(profileId) {
            _.pull(SpecProfile.records, SpecProfile.records[profileId]);
            delete SpecProfile.recordsIndex[profileId];
            if (SpecProfile.listener) {
                SpecProfile.listener.remove(profileId);
            }
        }

        return SpecProfile;
    }]);