const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const EmpleadosSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    }, 
    puesto: {
        type: String,
        required: true, 
    },
    fecha_contratacion: {
        type: Date, 
        required: true,
    }, 
    salario: {
        type: Number, 
        required: true
    }
}); 

module.exports = mongoose.model('Empleados', EmpleadosSchema); 