import TextModel from "../models/text.model.js";


export const get_all_guides = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const per_page = 20;
        const offset = (page - 1) * per_page
        const { count, rows } = await TextModel.findAndCountAll({
            offset,
            limit: per_page,
            order: [['created_at', 'DESC']]
        })
        res.status(200).json({
            data: rows,
            pagination: {
                total_items: count,
                current_page: page,
                totalPages: Math.ceil(count / per_page),
                pageSize: per_page
            }
        })
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Some error occured fetching all text guides" });
    }
};

export const get_text_guide = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const per_page = 20;
        const offset = (page - 1) * per_page
        const { count, rows } = await TextModel.findAndCountAll({
            where: { status: "approved" },
            offset,
            limit: per_page,
            order: [['created_at', 'DESC']]
        })
        res.status(200).json({
            data: rows,
            pagination: {
                total_items: count,
                current_page: page,
                totalPages: Math.ceil(count / per_page),
                pageSize: per_page
            }
        })
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Error fetching all text guides" });
    }
};

export const get_text_guide_by_id = async (req, res) => {
    try {
        const { id } = req.params
        const item = await TextModel.findByPk(id)

        if (!item) return res.status(404).json({ message: "Item not found" })
        res.status(200).json(item)
    }
    catch (err) {
        res.status(500).json({message: "Error fetching text guide"});
    }
}

export const post_text_guide = async (req, res) =>{
    try{
        const {title, content} = req.body
        const author = req.user.id
        let status = "pending"

        const user = req.user
        if (user.role == "admin") {
            // If the user is an admin, set the status to approved
            status = "approved"
        }

        const text_guide = await TextModel.create({
            title,
            content,
            status,
            author
        })
        res.status(201).json(text_guide)
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({message: "Some error occured creating the text guide"})
    }
}

export const approve_or_reject_text = async (req, res) =>{
    try{
        const {id} = req.params
        const {status} = req.body

        if(status != "approved" || status != "rejected"){
            return res.status(400).json({message: "Wrong route called"})
        }

        const text_guide = await TextModel.findByPk(id);

        text_guide.status = status
        await text_guide.save()

        res.status(200).json({message:'Text Guide status updated successfully'})
    }
    catch (err){
        console.error(err.message)
        res.status(500).json({message: "Some error occured approving the text guide"})
    }
}

export const approve_or_reject_for_support = async (req, res) =>{
    try{
        const {id} = req.params
        const {status} = req.body

        if(status != "approved" || status != "rejected"){
            return res.status(400).json({message: "Wrong route called"})
        }

        const text_guide = await TextModel.findByPk(id);
        if (status === "rejected") {
            text_guide.rejection_requested_by = req.user.id;
            text_guide.rejection_justification = req.body.rejection_justification;
            text_guide.rejection_status = "pending";
            message = 'Text Guide rejection requested successfully';
        }
        else{
            text_guide.status = status
            message = 'Text Guide approved successfully';
        }
        await text_guide.save()

        res.status(200).json({message: message})
    }
    catch (err){
        console.error(err.message)
        res.status(500).json({message: "Some error occured approving the text guide"})
    }
}

export const approve_or_reject_rejection_request = async (req, res) =>{
    try{
        const {id} = req.params
        const {rejection_status} = req.body

        if(rejection_status != "approved" || rejection_status != "denied"){
            return res.status(400).json({message: "Wrong route called"})
        }

        const text_guide = await TextModel.findByPk(id);

        if (rejection_status === "approved") {
            text_guide.status = "rejected";
            text_guide.rejection_status = "approved";
        } else {
            text_guide.rejection_status = "denied";
            text_guide.status = "approved";
            text_guide.rejection_requested_by = null;
            text_guide.rejection_justification = null;
        }
        await text_guide.save()
        res.status(200).json({message:'Text Guide rejection request processed successfully'})
    }
    catch (err){
        console.error(err.message)
        res.status(500).json({message: "Some error occured processing the rejection request"})
    }
}