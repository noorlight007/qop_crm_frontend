import LoadingGrow from '@/CommonComponent/LoadingGrow/LoadingGrow';
import DeleteConfirmationModal from '@/Components/Common/SupportTicket/SupportTicketDetails/Modals/DeleteConfirmationModal';
import {
  useDeleteSupportTicketCommentMutation,
  useFetchSupportTicketCommentsQuery,
  useFetchSupportTicketDetailsQuery,
  useMakeSupportTicketCommentMutation,
  useMakeSupportTicketCommentReplyMutation,
  useUpdateSupportTicketCommentMutation,
} from '@/Redux/Reducers/Common/SupportTicket/SupportTicketApi';
import {
  SupportTicketComment,
  SupportTicketCommentReply,
} from '@/Types/Common/SupportTicket/SupportTicketTypes';
import { formatDateAndTime } from '@/utils/dateAndTimeFormatter';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  FaEdit,
  FaFileAlt,
  FaPaperPlane,
  FaReply,
  FaSpinner,
  FaTimes,
  FaTrash,
  FaUser,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Col, Form, Input, Row } from 'reactstrap';

const SupportTicketComments: React.FC = () => {
  const { supportticketalias } = useParams();
  const { data: session } = useSession();

  const { data: ticketDetails } = useFetchSupportTicketDetailsQuery(
    { ticket_alias: supportticketalias as string },
    { skip: !supportticketalias },
  );

  const { data: comments, isLoading } = useFetchSupportTicketCommentsQuery(
    { ticket_alias: supportticketalias as string },
    { skip: !supportticketalias },
  );

  const [makeComment, { isLoading: isCommentLoading }] =
    useMakeSupportTicketCommentMutation();
  const [makeReply, { isLoading: isReplyLoading }] =
    useMakeSupportTicketCommentReplyMutation();
  const [updateComment, { isLoading: isUpdateLoading }] =
    useUpdateSupportTicketCommentMutation();
  const [deleteComment, { isLoading: isDeleteLoading }] =
    useDeleteSupportTicketCommentMutation();

  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [replyFiles, setReplyFiles] = useState<{ [key: number]: File[] }>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState<{ [key: string]: string }>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const isLocked =
    session?.user?.role !== 'SUPER_ADMIN' && ticketDetails?.status === 'CLOSED';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleReplyFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    commentId: number,
  ) => {
    if (isLocked) return;
    if (e.target.files) {
      setReplyFiles((prev) => ({
        ...prev,
        [commentId]: Array.from(e.target.files || []),
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    if (isLocked) return;
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveReplyFile = (commentId: number, index: number) => {
    if (isLocked) return;
    setReplyFiles((prev) => ({
      ...prev,
      [commentId]: prev[commentId]?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast.info('This ticket is closed. Commenting is disabled.');
      return;
    }
    if (!newComment.trim()) {
      toast.warning('Please enter a comment');
      return;
    }

    const formData = new FormData();
    formData.append('ticket_alias', supportticketalias as string);
    formData.append('message', newComment);

    selectedFiles.forEach((file) => {
      formData.append('upload_files', file);
    });

    try {
      await makeComment({
        payload: formData,
        ticket_alias: supportticketalias as string,
      }).unwrap();
      setNewComment('');
      setSelectedFiles([]);
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleSubmitReply = async (commentId: number) => {
    if (isLocked) {
      toast.info('This ticket is closed. Replying is disabled.');
      return;
    }
    const replyMessage = replyText[commentId];
    if (!replyMessage?.trim()) {
      toast.warning('Please enter a reply');
      return;
    }

    const formData = new FormData();
    formData.append('ticket_alias', supportticketalias as string);
    formData.append('message', replyMessage);
    formData.append('parent', commentId.toString());

    const files = replyFiles[commentId] || [];
    files.forEach((file) => {
      formData.append('upload_files', file);
    });

    try {
      await makeReply({
        payload: formData,
        ticket_alias: supportticketalias as string,
      }).unwrap();
      setReplyText((prev) => ({ ...prev, [commentId]: '' }));
      setReplyFiles((prev) => ({ ...prev, [commentId]: [] }));
      setReplyTo(null);
      toast.success('Reply added successfully');
    } catch (error) {
      console.error('Failed to add reply:', error);
      toast.error('Failed to add reply');
    }
  };

  const handleEditComment = (comment: SupportTicketComment) => {
    setEditingCommentId(comment.alias);
    setEditText((prev) => ({ ...prev, [comment.alias]: comment.message }));
  };

  const handleSaveEditComment = async (commentAlias: string) => {
    const editedMessage = editText[commentAlias];
    if (!editedMessage?.trim()) {
      toast.warning('Please enter a comment');
      return;
    }

    try {
      await updateComment({
        ticket_alias: supportticketalias as string,
        alias: commentAlias,
        payload: {
          message: editedMessage,
        },
      }).unwrap();
      setEditingCommentId(null);
      setEditText((prev) => ({ ...prev, [commentAlias]: '' }));
      toast.success('Comment updated successfully');
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = (commentAlias: string) => {
    setCommentToDelete(commentAlias);
    setDeleteModalOpen(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      await deleteComment({
        ticket_alias: supportticketalias as string,
        alias: commentToDelete,
      }).unwrap();
      toast.success('Comment deleted successfully');
      setDeleteModalOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const getFileNameFromUrl = (url: string) => {
    return url.split('/').pop() || 'Unknown file';
  };

  const renderReply = (reply: SupportTicketCommentReply, depth: number = 0) => (
    <div
      key={reply.id}
      className={`${depth > 0 ? 'ms-4' : ''} mt-3 border-l-primary border-2 rounded`}
    >
      <div className='d-flex align-items-start gap-3 p-3 bg-light-dark rounded'>
        <div className='flex-shrink-0'>
          {reply.author.profile_image ? (
            <img
              src={reply.author.profile_image}
              alt={reply.author.name}
              className='rounded-circle'
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
          ) : (
            <div
              className='rounded-circle bg-primary d-flex align-items-center justify-content-center text-white'
              style={{ width: '40px', height: '40px', flexShrink: 0 }}
            >
              <FaUser size={18} />
            </div>
          )}
        </div>
        <div className='flex-grow-1'>
          <div className='d-flex align-items-center gap-2 mb-1'>
            <strong className='text-dark'>{reply.author.name}</strong>

            <small className='text-muted'>
              {formatDateAndTime(reply.created_at)}
            </small>
          </div>
          <p className='mb-2' style={{ whiteSpace: 'pre-wrap' }}>
            {reply.message}
          </p>
          {reply.files && reply.files.length > 0 && (
            <div className='mb-2'>
              {reply.files.map((file) => (
                <a
                  key={file.alias}
                  href={file.file}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='d-inline-flex align-items-center gap-2 text-decoration-none border rounded px-3 py-2 me-2 mb-2 bg-white'
                  style={{ fontSize: '0.875rem' }}
                >
                  <FaFileAlt className='text-primary' />
                  <span>{getFileNameFromUrl(file.file)}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      {reply.replies && reply.replies.length > 0 && (
        <div className='ms-3'>
          {reply.replies.map((nestedReply) =>
            renderReply(nestedReply, depth + 1),
          )}
        </div>
      )}
    </div>
  );

  const renderComment = (comment: SupportTicketComment) => (
    <Card key={comment.id} className='mb-3 shadow-sm'>
      <CardBody>
        <div className='d-flex align-items-start gap-3'>
          <div className='flex-shrink-0'>
            {comment.author.profile_image ? (
              <img
                src={comment.author.profile_image}
                alt={comment.author.name}
                className='rounded-circle'
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              />
            ) : (
              <div
                className='rounded-circle bg-primary d-flex align-items-center justify-content-center text-white'
                style={{ width: '50px', height: '50px', flexShrink: 0 }}
              >
                <FaUser size={22} />
              </div>
            )}
          </div>
          <div className='flex-grow-1'>
            <div className='d-flex align-items-center gap-2 mb-2'>
              <strong className='text-dark'>{comment.author.name}</strong>

              <small className='text-muted'>
                {formatDateAndTime(comment.created_at)}
              </small>
            </div>
            <p className='mb-2' style={{ whiteSpace: 'pre-wrap' }}>
              {comment.message}
            </p>
            {comment.files && comment.files.length > 0 && (
              <div className='mb-3'>
                {comment.files.map((file) => (
                  <a
                    key={file.alias}
                    href={file.file}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='d-inline-flex align-items-center gap-2 text-decoration-none border rounded px-3 py-2 me-2 mb-2 bg-white'
                    style={{ fontSize: '0.875rem' }}
                  >
                    <FaFileAlt className='text-primary' />
                    <span>{getFileNameFromUrl(file.file)}</span>
                  </a>
                ))}
              </div>
            )}
            <div className='d-flex gap-2'>
              <Button
                color='link'
                size='sm'
                className='text-decoration-none p-0'
                disabled={isLocked}
                onClick={() =>
                  !isLocked &&
                  setReplyTo(replyTo === comment.id ? null : comment.id)
                }
              >
                <FaReply className='me-1' />
                Reply
              </Button>
              {(session?.user?.id === comment.author.id ||
                session?.user?.role === 'SUPER_ADMIN') && (
                <>
                  <Button
                    color='link'
                    size='sm'
                    className='text-decoration-none p-0 text-warning'
                    disabled={isLocked || isUpdateLoading}
                    onClick={() => handleEditComment(comment)}
                  >
                    <FaEdit className='me-1' />
                    Edit
                  </Button>
                  <Button
                    color='link'
                    size='sm'
                    className='text-decoration-none p-0 text-danger'
                    disabled={isLocked || isDeleteLoading}
                    onClick={() => handleDeleteComment(comment.alias)}
                  >
                    <FaTrash className='me-1' />
                    Delete
                  </Button>
                </>
              )}
            </div>

            {/* Edit Comment Form */}
            {editingCommentId === comment.alias && (
              <div className='mt-3 p-3 bg-light-dark rounded'>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveEditComment(comment.alias);
                  }}
                >
                  <Input
                    type='textarea'
                    rows={3}
                    value={editText[comment.alias] || ''}
                    disabled={isUpdateLoading}
                    onChange={(e) =>
                      setEditText((prev) => ({
                        ...prev,
                        [comment.alias]: e.target.value,
                      }))
                    }
                    className='mb-2'
                  />
                  <div className='d-flex gap-2'>
                    <Button
                      color='primary'
                      size='sm'
                      type='submit'
                      disabled={
                        isUpdateLoading || !editText[comment.alias]?.trim()
                      }
                    >
                      {isUpdateLoading ? (
                        <FaSpinner className='fa-spin' />
                      ) : (
                        <>
                          <FaPaperPlane className='me-1' />
                          Save
                        </>
                      )}
                    </Button>
                    <Button
                      color='secondary'
                      size='sm'
                      outline
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditText((prev) => ({
                          ...prev,
                          [comment.alias]: '',
                        }));
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            )}

            {/* Reply Input */}
            {replyTo === comment.id && (
              <div className='mt-3 p-3 bg-light-dark rounded'>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitReply(comment.id);
                  }}
                >
                  <Input
                    type='textarea'
                    rows={2}
                    placeholder='Write a reply...'
                    value={replyText[comment.id] || ''}
                    disabled={isLocked || isReplyLoading}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [comment.id]: e.target.value,
                      }))
                    }
                    className='mb-2'
                  />

                  {/* Reply Files Preview */}
                  {replyFiles[comment.id] &&
                    replyFiles[comment.id].length > 0 && (
                      <div className='mb-2'>
                        {replyFiles[comment.id].map((file, index) => (
                          <div
                            key={index}
                            className='d-inline-flex align-items-center gap-2 border rounded px-2 py-1 me-2 mb-2 bg-white'
                            style={{ fontSize: '0.875rem' }}
                          >
                            <FaFileAlt className='text-muted' />
                            <span>{file.name}</span>
                            <FaTimes
                              className='text-danger cursor-pointer'
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                handleRemoveReplyFile(comment.id, index)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}

                  <div className='d-flex gap-2'>
                    <Input
                      type='file'
                      multiple
                      onChange={(e) => handleReplyFileSelect(e, comment.id)}
                      className='form-control-sm'
                      style={{ maxWidth: '200px' }}
                      accept='image/*,.pdf,.doc,.docx'
                      disabled={isLocked || isReplyLoading}
                    />
                    <Button
                      color='primary'
                      size='sm'
                      type='submit'
                      disabled={
                        isLocked ||
                        isReplyLoading ||
                        !replyText[comment.id]?.trim()
                      }
                    >
                      {isReplyLoading ? (
                        <FaSpinner className='fa-spin' />
                      ) : (
                        <>
                          <FaPaperPlane className='me-1' />
                          Send
                        </>
                      )}
                    </Button>
                    <Button
                      color='secondary'
                      size='sm'
                      outline
                      onClick={() => {
                        setReplyTo(null);
                        setReplyText((prev) => ({ ...prev, [comment.id]: '' }));
                        setReplyFiles((prev) => ({
                          ...prev,
                          [comment.id]: [],
                        }));
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className='mt-3'>
                {comment.replies.map((reply) => renderReply(reply))}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );

  if (isLoading) {
    return (
      <div className='text-center py-4'>
        <LoadingGrow />
        <p className='text-muted mt-2'>Loading comments...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Add New Comment Form */}
      <Card className='mb-4 shadow-sm border-primary'>
        <CardBody>
          <Form onSubmit={handleSubmitComment}>
            <div className='d-flex align-items-start gap-3 mb-3'>
              <div className='flex-shrink-0'>
                {session?.user?.profile_image ? (
                  <img
                    src={session.user.profile_image}
                    alt='Your Avatar'
                    className='rounded-circle'
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    className='rounded-circle bg-primary d-flex align-items-center justify-content-center text-white'
                    style={{ width: '50px', height: '50px', flexShrink: 0 }}
                  >
                    <FaUser size={22} />
                  </div>
                )}
              </div>
              <div className='flex-grow-1'>
                <Input
                  type='textarea'
                  rows={3}
                  placeholder='Write a comment...'
                  value={newComment}
                  disabled={isLocked || isCommentLoading}
                  onChange={(e) => setNewComment(e.target.value)}
                  className='mb-2'
                />

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className='mb-2'>
                    <Row>
                      {selectedFiles.map((file, index) => (
                        <Col key={index} xs={12} sm={6} md={4} className='mb-2'>
                          <div className='d-flex align-items-center gap-2 border rounded px-2 py-1 bg-light-dark'>
                            <FaFileAlt className='text-muted' />
                            <span
                              className='text-truncate flex-grow-1'
                              style={{ fontSize: '0.875rem' }}
                            >
                              {file.name}
                            </span>
                            <FaTimes
                              className='text-danger cursor-pointer'
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleRemoveFile(index)}
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                <div className='d-flex gap-2 align-items-center'>
                  <Input
                    type='file'
                    multiple
                    onChange={handleFileSelect}
                    className='form-control-sm'
                    style={{ maxWidth: '250px' }}
                    accept='image/*,.pdf,.doc,.docx'
                    disabled={isLocked || isCommentLoading}
                  />
                  <Button
                    color='primary'
                    type='submit'
                    disabled={
                      isLocked || isCommentLoading || !newComment.trim()
                    }
                  >
                    {isCommentLoading ? (
                      <FaSpinner className='fa-spin me-1' />
                    ) : (
                      <FaPaperPlane className='me-1' />
                    )}
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>

      {/* Comments List */}
      {comments && comments.length > 0 ? (
        <div>
          {comments.map((comment: SupportTicketComment) =>
            renderComment(comment),
          )}
        </div>
      ) : (
        <div className='text-center py-5'>
          <p className='text-muted'>
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        title='Delete Comment'
        message='Are you sure you want to delete this comment? This action cannot be undone.'
        onConfirm={confirmDeleteComment}
        onCancel={() => setDeleteModalOpen(false)}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default SupportTicketComments;
