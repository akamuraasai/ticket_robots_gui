//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("O browser não suporta o IndexedDB.")
}

$('#progresso').progress();

var app = angular.module('mainApp', []);
app.controller('mainCtrl', appCtrl);

function appCtrl($scope, $http)
{
    $scope.inicia = iniciar;
    $scope.pausa = pausar;
    $scope.salva = salvar;
    $scope.continua = continuar;
    $scope.exporta = exportar;

    $scope.limite = '50000';
    $scope.offset = '1';
    $scope.produto = 'TAE';
    $scope.radius = '10000';
    $scope.token = 'MkM5RUUyNkYzRkQ5OEM1MTAxM0ZFMjg0QTdGNTBGNTItTW9uIEp1bCAxNSAxMDoyODowMCBCUlQgMjAxMw==';
    $scope.url_base = 'http://www.ticket.com.br/portal-web/affiliatenetwork/localizacao/json?buscaEnderecoNome=&';

    $scope.robos = [];
    $scope.afiliados = [];
    $scope.idsArr = [];
    $scope.prosseguir = false;
    $scope.porcento_total = 0;

    // IndexedDB
    //----------------------------------------------------
    $scope.db;
    $scope.request = window.indexedDB.open("rede_credenciada", 1);

    $scope.request.onerror = function(event) {
        console.log("error: ");
    };

    $scope.request.onsuccess = function(event) {
        $scope.db = $scope.request.result;
        console.log("success: "+ $scope.db);
    };

    $scope.getAll = function () {
        var objectStore = $scope.db.transaction("rede_credenciada").objectStore("rede_credenciada");
        $scope.afiliados = [];

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;

            if (cursor) {
                $scope.afiliados.push(cursor.value);
                cursor.continue();
            }
        };
    };

    $scope.addRede = function () {
        var request = $scope.db.transaction(["rede_credenciada"], "readwrite")
                .objectStore("rede_credenciada");

        request.clear();

        for (var i in $scope.afiliados) {
            request.add($scope.afiliados[i]);
        }

        request.onsuccess = function(event) {
            alert("Kenny has been added to your database.");
        };

        request.onerror = function(event) {
            alert("Unable to add data\r\nKenny is aready exist in your database! ");
        }
    };
    //----------------------------------------------------

    startAPICaller();

    function startAPICaller() {
        var num_robos = 8;

        makeRobots(num_robos);
        startRobots(num_robos);
        startArrays(num_robos);
    }

    function makeRobots(num_robos) {
        if (num_robos == 1)
            $scope.robos.push({lat: '05.505303', max_lat: '-32.897866', lon: '-74.235300', max_lon: '-34.609640', url: '', porcento: 0, num: 1, status: 0, requests: 0});

        else if (num_robos == 2)
            $scope.robos.push({lat: '05.505303', max_lat: '-32.897866', lon: '-74.235300', max_lon: '-54.235300', url: '', porcento: 0, num: 1, status: 0, requests: 0},
                {lat: '05.505303', max_lat: '-32.897866', lon: '-54.235300', max_lon: '-34.609640', url: '', porcento: 0, num: 2, status: 0, requests: 0});

        else if (num_robos == 4)
            $scope.robos.push({lat: '05.505303', max_lat: '-32.897866', lon: '-74.235300', max_lon: '-64.235300', url: '', porcento: 0, num: 1, status: 0, requests: 0},
                {lat: '05.505303', max_lat: '-32.897866', lon: '-64.235300', max_lon: '-54.235300', url: '', porcento: 0, num: 2, status: 0, requests: 0},
                {lat: '05.505303', max_lat: '-32.897866', lon: '-54.235300', max_lon: '-44.235300', url: '', porcento: 0, num: 3, status: 0, requests: 0},
                {lat: '05.505303', max_lat: '-32.897866', lon: '-44.235300', max_lon: '-34.609640', url: '', porcento: 0, num: 4, status: 0, requests: 0});

        else if (num_robos == 8)
            $scope.robos.push({lat: '05.505303', max_lat: '-32.897866', lon: '-74.235300', max_lon: '-69.235300', url: '', porcento: 0, num: 1, status: 0, requests: 0},
                {lat: '05.505303', max_lat: '-32.897866', lon: '-69.235300', max_lon: '-64.235300', url: '', porcento: 0, num: 2, status: 0, requests: 0},
                {lat: '05.505303', max_lat: '-32.897866', lon: '-64.235300', max_lon: '-59.235300', url: '', porcento: 0, num: 3, status: 0, requests: 0},
                {lat: '05.505303', max_lat: '-32.897866', lon: '-59.235300', max_lon: '-54.235300', url: '', porcento: 0, num: 4, status: 0, requests: 0},
                {lat: '05.505303', max_lat: '-32.897866', lon: '-54.235300', max_lon: '-49.235300', url: '', porcento: 0, num: 5, status: 0, requests: 0},
                {lat: '05.505303', max_lat: '-32.897866', lon: '-49.235300', max_lon: '-44.235300', url: '', porcento: 0, num: 6, status: 0, requests: 0},
                {lat: '05.505303', max_lat: '-32.897866', lon: '-44.235300', max_lon: '-39.235300', url: '', porcento: 0, num: 7, status: 0, requests: 0},
                {lat: '05.505303', max_lat: '-32.897866', lon: '-39.235300', max_lon: '-34.609640', url: '', porcento: 0, num: 8, status: 0, requests: 0});
    }

    function startRobots(num_robos) {
        for (var i = 0; i < num_robos; i++)
            setTheURLForAll(i);
    }

    function startArrays(num_robos) {
        for (var i = 0; i < num_robos; i++)
            $scope.idsArr[i] = [];
    }

    function setTheURLForAll(index) {
        var lat = $scope.robos[index].lat,
            lon = $scope.robos[index].lon;

        $scope.robos[index].url = `${$scope.url_base}lat=${lat}&limit=${$scope.limite}&lon=${lon}&offset=${$scope.offset}&product=${$scope.produto}&radius=${$scope.radius}&token=${$scope.token}`;
    }

    function iniciar() {
        var i = 0, num_robos = 8;
        for (i; i < num_robos; i++) {
            $scope.robos[i].prosseguir = true;
            lista(i);
        }
    }

    function pausar() {
        for (var i = 0; i < 8; i++) {
            $scope.robos[i].prosseguir = false;
            $scope.robos[i].status = 0;
        }
    }

    function salvar() {
        localStorage.state_robots = JSON.stringify($scope.robos);
        $scope.addRede();
    }

    function continuar() {
        $scope.robos = JSON.parse(localStorage.state_robots);
        $scope.getAll();
        iniciar();
    }

    function exportar() {
        onInsert($scope.afiliados);
    }

    function lista(indice)
    {
        if (!$scope.robos[indice].prosseguir) return;
        $scope.robos[indice].status = 1;
        setTheURLForAll(indice);

        var req = {
            url: $scope.robos[indice].url,
            method: 'GET'
        };

        var status = true;

        $http(req).then(function (dados) {
            status = dados.data.status;
            if (status) {
                $scope.afiliados = $scope.afiliados.concat(dados.data.affiliate.filter(filtraRepetidos, $scope.idsArr[indice]));

                $scope.idsArr[indice] = [];
                $scope.afiliados.forEach(function (item) {
                    $scope.idsArr[indice].push(item.id);
                });
            }

            $scope.robos[indice].lat = (parseFloat($scope.robos[indice].lat) - 0.05).toString();

            if (parseFloat($scope.robos[indice].lat) > $scope.robos[indice].max_lat) {
                $scope.robos[indice].requests++;
                $scope.robos[indice].porcento = ($scope.robos[indice].requests * 100) / 76807;
                porcentoTotal();
                lista(indice);
            }
            else if (parseFloat($scope.robos[indice].lon) < $scope.robos[indice].max_lon) {
                $scope.robos[indice].lat = '5.505303';
                $scope.robos[indice].lon = (parseFloat($scope.robos[indice].lon) + 0.05).toString();
                salvar();
                $scope.robos[indice].requests++;
                $scope.robos[indice].porcento = ($scope.robos[indice].requests * 100) / 76807;
                porcentoTotal();
                lista(indice);
            }
            else {
                $scope.robos[indice].concluido = true;
            }

        });
    }

    function porcentoTotal() {

        $scope.porcento_total = 0
        for (var i = 0; i < 8; i++)
            $scope.porcento_total += parseFloat($scope.robos[i].porcento);

        $scope.porcento_total /= 8;
        $scope.porcento_total = Math.round($scope.porcento_total);
        $('#progresso').progress({
            percent: $scope.porcento_total
        });
    }

    function filtraRepetidos(item) {
        return this.indexOf(item.id) == -1;
    }
}