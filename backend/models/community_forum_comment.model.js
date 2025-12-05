import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db.js';
import CommunityForum from './community_forum_model.js';
import User from './user.model.js';

class Comments extends Model { }

Comments.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            references: {
                model: "Users",
                key: "id"
            },
            allowNull: false
        },
        forum_id: {
            type: DataTypes.UUID,
            references: {
                model: "Community_Forum",
                key: "id"
            },
            allowNull: false
        },
        upvote: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        sequelize,
        modelName: "Comments",
        timestamps: true,
    }
)

Comments.belongsTo(CommunityForum,{
    foreignKey: "forum_id"
})
Comments.belongsTo(User, {
    foreignKey: "user_id"
})
export default Comments;