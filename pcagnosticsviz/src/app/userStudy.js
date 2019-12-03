// let userprofile = {level: 1,age:20,major:1};
// let recordSection = 2000;
// let maxdim = 6;
// let maxfeature = 9;
// function generateCollection(userprofile,dimension){
//     let r = [];
//     for (let f = 0; f<maxfeature; f++){
//         let temp_f = [];
//         for (let fs = 0; fs<maxfeature; fs++) {
//             temp_f[fs] = Math.random();
//         }
//         temp_f[f] = 1-Math.random()*0.2;
//         let temp_dim = [];
//         for (let ds = 0; ds<maxdim; ds++) {
//             if (ds<dimension)
//                 temp_dim[ds] = Math.round(Math.random()*2+1);
//             else
//                 temp_dim[ds] = 0
//         }
//         for (let l = 0; l<4; l++){
//             let temparr =  [userprofile.level,userprofile.age,userprofile.major,l];
//             for (let fs = 0; fs<maxfeature; fs++) {
//                 temparr.push(temp_f[fs]);
//             }
//             for (let ds = 0; ds<maxdim; ds++) {
//                 temparr.push(temp_dim[ds]);
//             }
//             r.push(temparr);
//         }
//     }
//     return r;
// }
// function normalize (l){
//     return l.map(f=>f.map((e,i)=>{
//         if (i<=3||(i>=(4+maxfeature)&&i<=(4+maxfeature+maxdim)))
//             return e/3;
//         else if(i===1)
//             return e/100;
//         else
//             return e;
//     }))
// }
// function getRecomendation(){ // replace this with function in Vung lib
//     let selection = [];
//     do{
//         let randNum = Math.round(Math.random()*35);
//         if (selection.indexOf(randNum)===-1)
//             selection.push(randNum);
//     }while(selection.length<4);
//     return selection;
// }
// function updateRecmendation(matrix, selection,collection){
//     return matrix.map((m,mi)=>collection[mi]===selection.choice?Math.min(m+selection.reward,20):m);
// }
//
// function user_simulation (selection,favorite){
//     for (let si in selection){
//         let s = selection[si];
//         if(favorite.indexOf(s)===-1) // not in favorite list
//         {
//             if (Math.random()>0.9)
//                 return {choice:s, reward: Math.random()};
//         }else{
//             if (Math.random()>0.1)
//                 return {choice:s, reward: Math.random()*5+0.5};
//         }
//     }
//     return undefined;
// }
//
// function getRecomendationAlltime(userprofile){
//     let temp =[];
//     for (let ds = 1; ds<(maxdim+1); ds++) {
//         temp.push(generateCollection(userprofile,ds));
//     }
//     return temp
// }
// function main(){
//     let log =[];
//     let log_rec =[];
//     let log_rew =[];
//     let recommenArr = getRecomendationAlltime(userprofile);
//     for (let i = 0 ; i<recordSection; i++) {
//         let currentMatrix = recommenArr[Math.round(Math.random()*(maxdim-1))];
//         let currentRecommend = getRecomendation();
//         let currentReward = [0,0,0,0];
//         let recordTrial = Math.round(Math.random()*20)+1;
//         for (let t = 0; t<recordTrial; t++){
//             let userChoice = user_simulation (currentRecommend,[1,4,6,9,22]);
//             if(userChoice)
//                 currentReward = updateRecmendation(currentReward,userChoice,currentRecommend);
//         }
//         log.push(currentMatrix);
//         log_rec.push(currentRecommend);
//         log_rew.push(currentReward);
//     }
//
//     download_json(log,'2000_userstudy_record_trial');
//     download_json(log_rec,'2000_userstudy_record_selection');
//     download_json(log_rew,'2000_userstudy_record_reward');
//     download_json(log.map(l=>normalize(l)),'2000_userstudy_record_trial_normalize');
//     download_json(log_rec,'2000_userstudy_record_selection_normalize');
//     download_json(log_rew.map(l=>l.map(e=>e/20)),'2000_userstudy_record_reward_normalize');
// }
// function download_json(data,filename) {
//     var str = JSON.stringify(data);
//     var file = new Blob([str], {type: '.json'});
//     var a = document.createElement("a"),
//         url = URL.createObjectURL(file);
//     a.href = url;
//     a.download = filename+'.json';
//     document.body.appendChild(a);
//     a.click();
//     setTimeout(function() {
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);
//     }, 0);
// }
//
// main();