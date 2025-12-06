import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db.js';
import Comments from './community_forum_comment.model.js';

class CommunityForum extends Model { }

CommunityForum.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        creator_id: {
            type: DataTypes.UUID,
            references: {
                model: "Users",
                key: "id"
            },
            allowNull: false,
        },
        is_private: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },

    },
    {
        sequelize,
        modelName: "Community_Forum",
        timestamps: true,
    }
)
CommunityForum.hasMany(Comments,{
    foreignKey: "forum_id",
    onDelete: "CASCADE"
})
export default CommunityForum;