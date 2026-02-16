import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { taskService } from '../../services/taskService';
import { formatDate } from '../../utils/helpers';
import '../../styles/Comments.css';

const TaskComments = ({ taskId }) => {
    const { user, isAdmin, isManager } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [taskId]);

    const loadComments = async () => {
        try {
            setLoading(true);
            const data = await taskService.getTaskComments(taskId);
            setComments(data);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmitting(true);
            const addedComment = await taskService.addComment(taskId, newComment);
            setComments([...comments, addedComment]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (comment) => {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditContent('');
    };

    const handleUpdateComment = async (e) => {
        e.preventDefault();
        if (!editContent.trim()) return;

        try {
            setSubmitting(true);
            const updatedComment = await taskService.updateComment(editingCommentId, editContent);
            setComments(comments.map(c => c.id === editingCommentId ? updatedComment : c));
            setEditingCommentId(null);
            setEditContent('');
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('Failed to update comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await taskService.deleteComment(commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        }
    };

    const getInitials = (userName) => {
        return userName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const canEdit = (comment) => {
        return user.id === comment.userId;
    };

    const canDelete = (comment) => {
        return user.id === comment.userId || isAdmin() || isManager();
    };

    if (loading) return <div>Loading comments...</div>;

    return (
        <div className="comments-section">
            <div className="comments-header">
                <h3>Comments</h3>
                <span className="comment-count">{comments.length}</span>
            </div>

            <div className="comments-list">
                {comments.length === 0 ? (
                    <div className="no-comments">No comments yet. Be the first to add one!</div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-avatar">
                                {getInitials(comment.userName)}
                            </div>
                            <div className="comment-content-wrapper">
                                <div className="comment-meta">
                                    <span className="comment-author">{comment.userName}</span>
                                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                </div>

                                {editingCommentId === comment.id ? (
                                    <form onSubmit={handleUpdateComment} className="edit-comment-form">
                                        <textarea
                                            className="comment-input"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="edit-actions">
                                            <button
                                                type="button"
                                                className="cancel-edit-btn"
                                                onClick={handleCancelEdit}
                                                disabled={submitting}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="update-comment-btn"
                                                disabled={submitting}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="comment-text">{comment.content}</div>
                                        <div className="comment-actions">
                                            {canEdit(comment) && (
                                                <button
                                                    className="comment-action-btn"
                                                    onClick={() => handleEditClick(comment)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {canDelete(comment) && (
                                                <button
                                                    className="comment-action-btn delete"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleAddComment} className="add-comment-form">
                <textarea
                    className="comment-input"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    type="submit"
                    className="submit-comment-btn"
                    disabled={!newComment.trim() || submitting}
                >
                    Post
                </button>
            </form>
        </div>
    );
};

export default TaskComments;
