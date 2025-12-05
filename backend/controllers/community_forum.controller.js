import sequelize from "../lib/db";
import Comments from "../models/community_forum_comment.model";
import CommunityForum from "../models/community_forum_model";

export const get_community_forum = async (req, res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page-1)*limit;
        const {count, rows} = await CommunityForum.findAndCountAll({
            include:[
                {
                    model: Comments,
                    attributes:[]
                }
            ],
            attributes:{
                include:[
                    [
                        sequelize.fn("COUNT", sequelize.col("Comments.id")),
                        "Total_Comments"
                    ]
                ]
            },
            group: ["Community_Forum.id"],
            offset,
            limit,
            order: [['created_at', 'DESC']]
        })
        res.status(200).json({
            data: rows,
            pagination:{
                total_items: count,
                total_pages: Math.ceil(count/limit),
                page_size: limit

            }
        })
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({
            message: "Error occured fetching Community records please try again"
        })
    }
}

export const get_community_form_by_id = async (req, res)=>{
    try{
        const {id} = req.params
        const community_forum = CommunityForum.findbyPK(id)
        if(community_forum == null){
            res.status(404).json({
                "message":"Community forum not found",
            })
        }
        res.status(200).json({
            "message": "Community_forum found successfully",
            "data": community_forum
        })
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({
            message:"Error fetching community forum"
        })
    }
}

export const add_comment_to_forum = async (req, res)=>{
    try{
        const {forum_id} = req.params
        const forum = CommunityForum.findbyPK(forum_id)
        if(forum == null){
            res.status(404).json({
                "message": "No forum found"
            })
        }
        const comment = Comments.create()
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({
            message: "Error occured adding comment"
        })
    }
}