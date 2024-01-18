/* HTTP status code constant starts */
module.exports.SERVER_ERROR_HTTP_CODE = 412;
module.exports.SERVER_NOT_ALLOWED_HTTP_CODE = 503;
module.exports.SERVER_OK_HTTP_CODE = 200;
module.exports.SERVER_NOT_FOUND_HTTP_CODE = 404;
module.exports.SERVER_INTERNAL_ERROR_HTTP_CODE = 500;
/* HTTP status codeconstant ends */

/* General Errors and Routes messages constants start */
module.exports.ROUTE_NOT_FOUND = 'You are at wrong place. Shhoooo...';
module.exports.SERVER_ERROR_MESSAGE = 'Something bad happend. It\'s not you, it\'s me.';

/* File upload path */
module.exports.PROJECT_PLAN = 'project/plan/';
module.exports.PLAN = 'plan/';
module.exports.USER_PROFILE = 'users/profile/';
module.exports.PROJECT_PATH = 'project/';


/* FIle icons */
module.exports.FILE_ICONS = {
    "audio":"https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/Audio.png",
    "other":"https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/Otherfiles.png",
    "spreadsheet":"https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/Spreadsheet.png",
    "compress":"https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/compress.png",
    "doc":"https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/doc.png",
    "image":"https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/image.png",
    "pdf":"https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/pdf.png",
    "presantation":"https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/presantation.png",
    "video":"https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/video.png",
}

module.exports.FILE_TYPE_GROUP = {
    "image":[ "png", "jpeg", "jpg", "gif", "bmp", "tiff", "tif", "tn3", "tp3", "svg"],
    "audio":["avi","ogg","wav","mp3"],
    "video":[ "webm", "mov", "mp4", "mpg", "f4v", "wmv", "flv", "mkv" ],
    "other":[ "rvt", "dwg", "dxf", "kmz", "dgn", "kml", "dwf", "dwfx", "ifc", "nwd", "mpp", "pan", "rd3", "xer"],
    "compress":["7z","zip","zipx","rar"],
    "presantation":[ "ppt", "pptx", "pps", "key", "odp"],
    "spreadsheet":["xlsx","xls","xltx","xlt","xlsm","ods","numbers","csv"],
    "doc":["doc","docx","pages","odt","odf","txt","rtf"],
    "pdf":["pdf"]
}

