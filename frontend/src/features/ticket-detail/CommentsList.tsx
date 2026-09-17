import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_COMMENT } from '../../core/graphql/mutations';
import { GET_TICKET_DETAIL, GET_TICKETS } from '../../core/graphql/queries';
import { Comment } from '../../shared/types';
import { MessageSquare, Send, User, Clock } from 'lucide-react';

interface CommentsListProps {
  ticketId: string;
  comments: Comment[];
}

export const CommentsList: React.FC<CommentsListProps> = ({ ticketId, comments }) => {
  const [author, setAuthor] = useState('Martín (Agente)');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [addComment, { loading }] = useMutation(ADD_COMMENT, {
    refetchQueries: [
      { query: GET_TICKET_DETAIL, variables: { id: ticketId } },
      { query: GET_TICKETS }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setErrorMessage(null);
      await addComment({
        variables: {
          input: {
            ticketId,
            author: author.trim() || 'Agente',
            content: content.trim()
          }
        }
      });
      setContent('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al agregar el comentario');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              💬 Hilo de Comentarios & Seguimiento
            </h4>
            <p className="text-[11px] text-slate-500">Agrega notas internas o actualizaciones sobre este ticket</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          {comments.length} {comments.length === 1 ? 'comentario' : 'comentarios'}
        </span>
      </div>

      {/* Lista de comentarios */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="text-center py-6 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
            <MessageSquare className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
            <p className="text-xs text-slate-500 font-medium">Aún no hay comentarios registrados.</p>
            <p className="text-[11px] text-slate-400">Sé el primero en dejar una actualización para el equipo.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px]">
                    <User className="w-3 h-3" />
                  </div>
                  {comment.author}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap pl-6.5 font-normal">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Formulario nuevo comentario */}
      <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-slate-100">
        {errorMessage && (
          <p className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">{errorMessage}</p>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-slate-600">Autor:</label>
            <input
              type="text"
              placeholder="Tu nombre o cargo"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-slate-800"
            />
          </div>
          <div className="flex gap-2">
            <textarea
              required
              rows={2}
              placeholder="Escribe aquí un nuevo comentario o actualización para este ticket..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none text-slate-800"
            />
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-4 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg disabled:opacity-50 transition-all flex flex-col items-center justify-center gap-1 shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? '...' : 'Enviar'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
