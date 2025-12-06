import sequelize from "../lib/db";
import Comments from "../models/community_forum_comment.model";
import CommunityForum from "../models/community_forum_model";

export const create_community_forum = async(req, res)=>{
    try{
        const creator_id = req.user.id
        const {title, content} = req.body
        const community = await CommunityForum.create({
            title,
            content,
            creator_id
        })
        res.status(201).json({
            "message":"Community Created succesfully",
            "data":community
        })
    }
    catch(err){
        console.error(err)
        res.status(500).json({
            "message":"Server error failed to create Community Forum"
        })
    }

}

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
        const community_forum = await CommunityForum.findbyPK(id)
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
        const forum = await CommunityForum.findbyPK(forum_id)
        if(forum == null){
            res.status(404).json({
                "message": "No forum found"
            })
        }
        const user_id = req.user.id
        const {content} = req.body
        const comment = Comments.create(
            user_id,
            forum_id,
            content
        )
        res.status(201).json({
            "data": comment,
            "message": "Successfully created"
        })
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({
            message: "Error occured adding comment"
        })
    }
}

export const upvote_comment = async (req, res)=>{
    try{
        const {comment_id} = req.params
        const comment = await Comments.findbyPK(comment_id)
        if(comment == null){
            res.status(404).json({
                "message":"Comment not found"
            })
        }
        await comment.increment({upvote: 1});
        await comment.reload();
        res.status(200).json({
            "data": comment,
            "message": "Upvoted successfully"
        })
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({
            "message":"Some error occured upvoting the comment"
        })
    }
}

export const downvote_comment = async(req, res) =>{
    try{
        const {comment_id} = req.params
        const comment = await Comments.findbyPK(comment_id)
        if(comment == null){
            res.status(404).json({
                "message":"comment not found"
            })
        }
        await comment.decrement({upvote: 1})
        await comment.reload()
        res.status(200).json({"data":comment,
            "message": "Comment downvoted successfully"
        })
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({"message":"Error occured downvoting comment"})
    }
}

export const delete_comment = async(req, res)=>{
    try{
        const {comment_id} = req.params
        const delete_comment = await Comments.destroy({
            where: {id: comment_id}
        });
        if(delete_comment===0){
            return res.status(404).json({"message":"Comment not found"})
        }
        res.status(204).json({"message":"Comment deleted succesfully"})
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({"message":"Some error occured deleting comment"})
    }
}