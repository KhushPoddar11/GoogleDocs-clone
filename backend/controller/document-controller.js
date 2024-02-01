import documents from "../schema/document-schema.js";

export const getDocument = async (id)=>{
    if(id == null) return;

    const document = await documents.findById(id);

    if(document) return document;

    return await documents.create({_id:id, data:" "});
}

export const updateDocument = async (id, data)=>{
    return await documents.findByIdAndUpdate(id,{data});
}