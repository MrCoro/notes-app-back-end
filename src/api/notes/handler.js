const ClientError = require('../../exceptions/ClientError');

class NoteHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }


  postNoteHandler(request, h){
    try{
      this._validator.validateNotePayload(request.payload);

      const {title="untitled", tags, body} = request.payload;

      const noteId = this._service.addNotes({title, body, tags});
  
      const response = h.response({
        status: "success",
        message: "Catatan berhasil ditambahkan",
        data: {
          noteId
        },
      });
      response.code(201);
      return response;
    } catch(e) {
      if (e instanceof ClientError){
        const response = h.response({
          status: "failed",
          message: e.message
        });

        response.code(e.statusCode);
        return response;
      }  

      //server error!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  getNotesHandler(){
    const notes = this._service.getNotes();

    return {
      status: "success",
      data: {
        notes,
      },
    };

  }

  getNoteByIdHandler(request,h){
    try {
      const {id} = request.params;
      const note = this._service.getNoteById(id);
      
      return {
        status: "success",
        data: {
          note,
        },
      };

    } catch (e){
      if (e instanceof ClientError){
        const response = h.response({
          status: "fail",
          message: e.message,
        });
  
        response.code(e.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    
    }
  }

  putNoteByIdHandler(request, h){
    try{
      this._validator.validateNotePayload(request.payload);

      const {id} = request.params;
      
      this._service.editNoteById(id, request.payload);
      
      return {
        status: "success",
        message: "Catatan berhasil diperbarui"
      };

    } catch (e){
      if (e instanceof ClientError){
        const response = h.response({
          status: "fail",
          message: e.message,
        });
  
        response.code(e.statusCode);
        return response;
      }

      //server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf terjadi kegagalan pada server kami"
      });

      response.code(500);
      return response;
    }

  }


  deleteNoteByIdHandler(request){
    try{
      const {id} = request.params;
      this._service.deleteNoteById(id);
      
      return {
        status: "success",
        message: "Catatan berhasil dihapus",
      };
    } catch(e){
      if (e instanceof ClientError){
        const response = h.response({
          status: "fail",
          message: "Catatan gagal dihapus, Id tidak ditemukan",
        });
  
        response.code(e.statusCode);
        return response;
      }

      //server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf terjadi kegagalan pada server kami",
      });

      response.code(500);
      return response;
    }
  
  }
  
}

module.exports = NoteHandler;