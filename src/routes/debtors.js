const errors = require('restify-errors')

const Debtor = require('../models/Debtor');
module.exports = server => {
    // Fetch All Debtors 
    server.get('/api/debtors/', async (req, res, next) => {
       try {
        const debtors = await Debtor.find({}) //query to look for all debtors
        res.send(debtors); // send the result from the query above back to the user 
        next();
       } catch (error) {
           return next(new errors.InvalidContentError(error))
       }
    
    });

    // Add a new Debtor to list 
    server.post('/api/debtors', async (req, res, next) => {
        // Check if what is being passed is in JSON
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("This API expects: 'application/json'"))
        }
        const { name, email, phone, debt } = req.body;
        const debtor = new Debtor({
            name,
            email,
            phone,
            debt
            

        });

        try {
            const newDebtor = await debtor.save() //save  a debtor to the database
            res.send(201) //201 means created
            next(); 
            
        } catch (error) {
            return next(new errors.InternalError(error.message))
        }
    });

    //Fetch a Single Debtor 
     server.get('/api/debtors:id', async (req, res, next) => {
       try {
        const debtor = await Debtor.findById(req.params.id)
        res.send(debtor);
        next();
       } catch (error) {
           return next(new errors.ResourceNotFound(`Hi, there seems to be no debtor with ID of: ${req.params.id}`))
       }
    
     });
    
    // Update The Details of an Exising Debtor
     server.put('/api/debtors:id', async (req, res, next) => {
        // Check if what is being passed is in JSON
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("This API expects: 'application/json'")) // data must be in json format 
        }
       
        try {
            const debtor = await Debtor.findOneAndUpdate({_id: req.params.id}, req.body)
            res.send(200)
            next();
            
        } catch (error) {
            return next(new errors.ResourceNotFound(`Hi, there seems to be no debtor with ID of: ${req.params.id}`)) // this is called when a debtor with the ID does not exist
        }
        }
    );
    //Delete an Already Existing Debtor

    server.del('/api/debtors:id', async (req, res, next) => { 
    //restify uses 'server.del' instead of 'server.delete' for delete operations

        try {
            const debtor = await Debtor.findOneAndRemove({ _id: req.params.id }) // await a query to look for debtor with the given id
            res.send(204); // 204 response means no content 
            next()
        } catch (error) {
             return next(new errors.ResourceNotFound(`Hi, there seems to be no debtor with ID of: ${req.params.id}`)) //this is called when a debtor with the ID does not exist
        }
    })

}