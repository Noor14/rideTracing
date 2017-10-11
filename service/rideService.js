
app.service('rideService', function($q, $http){
    var vm = this;
    vm.trackRide = function(path){
  var deffered = $q.defer();
    var obj = {
        url:"http://panteradev.cloudapp.net/maqsab_test_api/api/v1/rides/"+path,
        method:"GET",
        headers:{"contentType":"application/JSON"}
    };
        $http(obj).then(function(res){
            deffered.resolve(res);
        },function(err){
           deffered.reject(err);
        });
        return deffered.promise;
}
});
