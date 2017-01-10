var localDB = null;

function onInit(){
    try {
        if (!window.openDatabase) {
            console.log("Erro: Seu navegador n�o permite banco de dados.");
        }
        else {
            initDB();
            createTables();
            //queryAndUpdateOverview();
        }
    }
    catch (e) {
        if (e == 2) {
            console.log("Erro: Vers�o de banco de dados inv�lida.");
        }
        else {
            console.log("Erro: Erro desconhecido: " + e + ".");
        }
        return;
    }
}

function initDB(){
    var shortName = 'DB_rede_ticket';
    var version = '1.0';
    var displayName = 'BancoRedeTicket';
    var maxSize = 655360000; // Em bytes
    localDB = window.openDatabase(shortName, version, displayName, maxSize);
}

function createTables() {
    var query = 'CREATE TABLE IF NOT EXISTS rede_credenciada (id int, address text, category text, city text, companyName text, district text, state text, telephone text, tradingName text, zipcode text, lat float, lon float);';
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            console.log("Tabela 'rede_credenciada' status: OK.");
        });
    }
    catch (e) {
        console.log("Erro: Data base 'rede_credenciada' n�o criada " + e + ".");
        return;
    }
}

//2. Query e visualiza��o de Update

function onDelete(id){
    var query = "delete from rede_credenciada where id=?;";
    try {
        localDB.transaction(function(transaction){

            transaction.executeSql(query, [id], function(transaction, results){
                if (!results.rowsAffected) {
                    console.log("Erro: Delete n�o realizado.");
                }
                else {
                    console.log("Linhas deletadas:" + results.rowsAffected);
                    queryAndUpdateOverview();
                }
            }, errorHandler);
        });
    }
    catch (e) {
        console.log("Erro: DELETE n�o realizado " + e + ".");
    }

}

function onCreate(item){
    var query = "insert into rede_credenciada (id, address, category, city, companyName, district, state, telephone, tradingName, zipcode, lat, lon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [item.id, item.address, item.category, item.city, item.companyName, item.district, item.state, item.telephone, item.tradingName, item.zipcode, item.geolocation.lat, item.geolocation.long], function(transaction, results){
                if (!results.rowsAffected) {
                    console.log("Erro: Inser��o n�o realizada");
                }
                else {
                    console.log("Inser��o realizada, linha id: " + results.insertId);
                    //queryAndUpdateOverview();
                }
            }, errorHandler);
        });
    }
    catch (e) {
        console.log("Erro: INSERT n�o realizado " + e + ".");
    }
}

function onInsert(array){
    var query = "insert into rede_credenciada (id, address, category, city, companyName, district, state, telephone, tradingName, zipcode, lat, lon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    try {
        localDB.transaction(function(transaction){

            array.forEach(function(row){
                transaction.executeSql(query, [row.id, row.address, row.category, row.city, row.companyName, row.district, row.state, row.telephone, row.tradingName, row.zipcode, row.geolocation.lat, row.geolocation.long], function(transaction, results){
                    if (!results.rowsAffected) {
                        console.log("Erro: Inser��o n�o realizada");
                    }
                    else {
                        //console.log("Inser��o realizada, linha id: " + results.insertId);
                        //queryAndUpdateOverview();
                    }
                }, errorHandler);
            });
            console.log("Inser��o concluida com sucesso.");
        });
    }
    catch (e) {
        console.log("Erro: INSERT n�o realizado " + e + ".");
    }
}

function onSelect(id){
    query = "SELECT * FROM rede_credenciada where id=?;";
    try {
        localDB.transaction(function(transaction){

            transaction.executeSql(query, [id], function(transaction, results){

                var row = results.rows.item(0);
                console.log(row);

            }, function(transaction, error){
                console.log("Erro: " + error.code + "<br>Mensagem: " + error.message);
            });
        });
    }
    catch (e) {
        console.log("Error: SELECT n�o realizado " + e + ".");
    }

}

function queryAndUpdateOverview(){
    //Realiza a leitura no banco e cria novas linhas na tabela.
    var query = "SELECT * FROM rede_credenciada;";
    try {
        localDB.transaction(function(transaction){

            transaction.executeSql(query, [], function(transaction, results){
                console.log(results.rows);
            }, function(transaction, error){
                console.log("Erro: " + error.code + "<br>Mensagem: " + error.message);
            });
        });
    }
    catch (e) {
        console.log("Error: SELECT n�o realizado " + e + ".");
    }
}

errorHandler = function(transaction, error){
    console.log("Erro: " + error.message);
    return true;
}

nullDataHandler = function(transaction, results){
}