/* MENUS */

// menu para reportes
function menuReportes(email, rol){
    var opciones = [];
    if(rol === "ciudadano"){
        opciones = [
            {valor: "Todos los reportes", url:"/"+email},
            {valor: "Mis reportes", url:"/"+email+"/reportes/mis-reportes"},
            {valor: "Buscar reportes", url:"/"+email+"/buscar-reportes"},
            {valor: "Nuevo reporte", url:"/"+email+"/nuevo-reporte"}
        ];
    }else{
        opciones = [
            {valor: "Reportes recibidos", url:"/"+email},
            {valor: "Buscar reportes", url:"/"+email+"/buscar-reportes"}
        ];
    }
    return opciones;
}

//menu de configuración
function menuConfig(email, rol){
    var opciones = [];
    if(rol === "ciudadano"){
        opciones = [
            {valor: "Perfil", url:"/"+email+"/perfil"},
            //{valor: "suscribir problema", url:"/"+email+"/config"},
            {valor: "suscribir ciudad", url: "/"+email+"/suscribir-ciudad"}
        ];
    }else{
        opciones = [
            {valor: "Perfil", url:"/"+email+"/perfil"},
            {valor: "suscribir problema", url:"/"+email+"/config"},
            {valor: "Respuestas rapidas", url: "/"+email+"/respuestas-rapidas"}
        ];
    }
    return opciones;
}

// menu de encabezado
function menuHead(email){
    menuHeader = [
        {option: 'reportes', value: '/'+email, id: "header-option-reportes"},
        {option: 'personas', value: '/'+email+'/personas', id: "header-option-reporteros"},
        {option: 'configuracion', value: '/'+email+'/config', id: "header-opcion-configuracion"},
        {option: 'notificaciones', value: '/'+email+'/notificaciones', id: "header-opcion-notificaciones"},
        {option: 'salir', value: '/user/logout', id: "header-opcion-logout"}
    ];
    return menuHeader;
}

function menuNotificaciones(email){
    options = [
        {valor : "Todas las notificaciones", url: "/"+email+"/notificaciones"},
        {valor: "Buscar notificaciones", url: "/"+email+"/buscar-notificaciones"}
    ];
    
    return options;
}

function menuPersonas(email, rol){
    options = [
        {valor : "Buscar personas y organizaciones", url: "/"+email+"/personas"},
        {valor: "mis contactos", url: "/"+email+"/mis-contactos"}
    ];
    
    return options;
}

module.exports.menuReportes = menuReportes;
module.exports.menuConfig = menuConfig;
module.exports.menuHeader = menuHead;
module.exports.menuNotificaciones = menuNotificaciones;
module.exports.menuPersonas = menuPersonas;