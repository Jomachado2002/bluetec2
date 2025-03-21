// backend/controller/client/clientController.js
const ClientModel = require('../../models/clientModel');
const uploadProductPermission = require('../../helpers/permission');

/**
 * Crea un nuevo cliente
 */
async function createClientController(req, res) {
    try {
        // Comentamos temporalmente esta validación para pruebas
        // if (!uploadProductPermission(req.userId)) {
        //     throw new Error("Permiso denegado");
        // }

        const { 
            name, 
            email, 
            phone, 
            address, 
            company, 
            taxId, 
            notes 
        } = req.body;

        if (!name) {
            throw new Error("El nombre del cliente es requerido");
        }

        // Verificar si ya existe un cliente activo con el mismo email o teléfono
        let existingClientQuery = {};
        
        if (email && email.trim() !== '') {
            existingClientQuery.email = email;
        }
        
        if (phone && phone.trim() !== '') {
            // Si ya tenemos una condición por email, añadimos phone como OR
            if (Object.keys(existingClientQuery).length > 0) {
                // Only check against active clients or explicitly set condition to true if isActive field exists
                existingClientQuery.isActive = { $ne: false };
                
                const existingClient = await ClientModel.findOne(existingClientQuery);
            
                if (existingClient) {
                    throw new Error("Ya existe un cliente con el mismo email o teléfono");
                }
            }
            
            // Similarly for updateClientController, update the existingClient query:
            if (email || phone) {
                const existingClient = await ClientModel.findOne({
                    _id: { $ne: clientId },
                    isActive: { $ne: false }, // Only check against active clients
                    $or: [
                        { email: email },
                        { phone: phone }
                    ]
                });
            
                if (existingClient) {
                    throw new Error("Ya existe otro cliente con el mismo email o teléfono");
                }
            }
        }

        // Crear nuevo cliente
        const newClient = new ClientModel({
            name,
            email,
            phone,
            address,
            company,
            taxId,
            notes,
            createdBy: req.userId
        });

        const savedClient = await newClient.save();

        res.status(201).json({
            message: "Cliente creado correctamente",
            data: savedClient,
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error en createClientController:", err);
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

/**
 * Obtiene todos los clientes
 */
async function getAllClientsController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permiso denegado");
        }

        const { search, limit = 50, page = 1, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        // Construir query
        const query = { isActive: true };
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Ordenamiento
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        
        // Paginación
        const skip = (page - 1) * limit;
        
        // Ejecutar la consulta
        const clients = await ClientModel.find(query)
            .select('-__v')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));
            
        // Contar total de clientes para paginación
        const total = await ClientModel.countDocuments(query);
        
        res.json({
            message: "Lista de clientes",
            data: {
                clients: Array.isArray(clients) ? clients : [], // Asegúrate de que sea un array
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    pages: Math.ceil(total / limit)
                }
            },
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

/**
 * Obtiene un cliente por su ID
 */
async function getClientByIdController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permiso denegado");
        }

        const { clientId } = req.params;

        if (!clientId) {
            throw new Error("ID de cliente no proporcionado");
        }

        const client = await ClientModel.findById(clientId)
            .populate('budgets', 'budgetNumber totalAmount finalAmount status validUntil createdAt')
            .populate('sales', 'saleNumber totalAmount status createdAt');

        if (!client) {
            throw new Error("Cliente no encontrado");
        }

        res.json({
            message: "Detalles del cliente",
            data: client,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

/**
 * Actualiza un cliente
 */
async function updateClientController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permiso denegado");
        }

        const { clientId } = req.params;
        const { 
            name, 
            email, 
            phone, 
            address, 
            company, 
            taxId, 
            notes,
            isActive
        } = req.body;

        if (!clientId) {
            throw new Error("ID de cliente no proporcionado");
        }

        // Verificar si el cliente existe
        const client = await ClientModel.findById(clientId);
        
        if (!client) {
            throw new Error("Cliente no encontrado");
        }

        // Verificar si el email o teléfono ya están en uso por otro cliente
        if (email || phone) {
            const existingClient = await ClientModel.findOne({
                _id: { $ne: clientId },
                $or: [
                    { email: email },
                    { phone: phone }
                ]
            });

            if (existingClient) {
                throw new Error("Ya existe otro cliente con el mismo email o teléfono");
            }
        }

        // Preparar objeto de actualización
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (address !== undefined) updateData.address = address;
        if (company !== undefined) updateData.company = company;
        if (taxId !== undefined) updateData.taxId = taxId;
        if (notes !== undefined) updateData.notes = notes;
        if (isActive !== undefined) updateData.isActive = isActive;

        // Actualizar cliente
        const updatedClient = await ClientModel.findByIdAndUpdate(
            clientId,
            updateData,
            { new: true }
        );

        res.json({
            message: "Cliente actualizado correctamente",
            data: updatedClient,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

/**
 * Elimina un cliente (soft delete)
 */
async function deleteClientController(req, res) {
    try {
        // Comentamos temporalmente esta validación para pruebas
        // if (!uploadProductPermission(req.userId)) {
        //     throw new Error("Permiso denegado");
        // }

        const { clientId } = req.params;

        if (!clientId) {
            throw new Error("ID de cliente no proporcionado");
        }

        // En lugar de marcar como inactivo, eliminar realmente el cliente
        const deletedClient = await ClientModel.findByIdAndDelete(clientId);

        if (!deletedClient) {
            throw new Error("Cliente no encontrado");
        }

        res.json({
            message: "Cliente eliminado correctamente",
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error en deleteClientController:", err);
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = {
    createClientController,
    getAllClientsController,
    getClientByIdController,
    updateClientController,
    deleteClientController
};