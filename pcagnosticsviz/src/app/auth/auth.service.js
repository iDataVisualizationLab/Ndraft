angular.module('pcagnosticsviz').factory("Auth", ["$firebaseAuth",
    function($firebaseAuth,firebaseDataService) {
        var firebaseAuthObject = $firebaseAuth();
        var service = {
            firebaseAuthObject: firebaseAuthObject,
            register: register,
            login: login,
            loginAnonymous: loginAnonymous,
            logout: logout,
            isLoggedIn: isLoggedIn,
            sendWelcomeEmail: sendWelcomeEmail
        };
        return service;
        ////////////
        function register(user) {
            return firebaseAuthObject.$createUserWithEmailAndPassword(user.email, user.password);
        }
        function login(user) {
            return firebaseAuthObject.$signInWithEmailAndPassword(user.email, user.password);
        }
        function loginAnonymous(user) {
            return firebaseAuthObject.$signInAnonymously();
        }
        function logout() {
            firebaseAuthObject.$signOut();
        }
        function isLoggedIn() {
            return firebaseAuthObject.$getAuth();
        }
        function sendWelcomeEmail(emailAddress) {
            firebaseDataService.emails.push({
                emailAddress: emailAddress
            });
        }
        // return $firebaseAuth();
    }
]);
