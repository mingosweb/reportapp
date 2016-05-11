/* MENUS */

function menuReportes(email, rol){
    var opciones = [];
    if(rol === "ciudadano"){
        opciones = [
            {valor: "Todos los reportes", url:"/"+email},
            {valor: "Mis reportes", url:"/"+email+"/mis-reportes"},
            {valor: "Buscar reportes", url:"/"+email+"/buscar-reportes"},
            {valor: "Nuevo reporte", url:"/"+email+"/nuevo-reporte"}
        ];
    }else{
        opciones = [
            {valor: "Reportes recibidos", url:"/"+email},
            {valor: "Buscar reportes", url:"/"+email+"/mis-reportes"}
        ];
    }
    return opciones;
}

function menuConfig(email, rol){
    var opciones = [];
    if(rol === "ciudadano"){
        opciones = [
            {valor: "Perfil", url:"/"+email+"/perfil"},
            {valor: "Cambiar contraseña", url:"/"+email+"/cambiar-clave"},
            {valor: "Desactivar cuenta", url:"/"+email+"/desactivar"},
            {valor: "suscribir problema", url:"/"+email+"/suscribir-problema"},
            {valor: "suscribir ciudad", url: "/"+email+"/suscribir-ciudad"}
        ];
    }else{
        opciones = [
            {valor: "Perfil", url:"/"+email+"/perfil"},
            {valor: "Cambiar contraseña", url:"/"+email+"/cambiar-clave"},
            {valor: "Desactivar cuenta", url:"/"+email+"/desactivar"},
            {valor: "suscribir problema", url:"/"+email+"/suscribir-problema"},
            {valor: "Condecoraciones", url: "/"+email+"/suscribir-ciudad"},
            {valor: "Respuestas rapidas", url: "/"+email+"/suscribir-ciudad"}
        ];
    }
    return opciones;
}

function menuHead(email){
    menuHeader = [
        {option: 'reportes', value: '/'+email},
        {option: 'reporteros', value: '/'+email},
        {option: 'configuracion', value: '/'+email+'/config'},
        {option: 'notificaciones', value: '/'+email},
        {option: 'salir', value: '/user/logout'}
    ];
    return menuHeader;
}

module.exports.menuReportes = menuReportes;
module.exports.menuConfig = menuConfig;
module.exports.menuHeader = menuHead;