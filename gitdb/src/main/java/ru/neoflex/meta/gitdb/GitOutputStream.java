package ru.neoflex.meta.gitdb;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.resource.URIConverter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

public class GitOutputStream extends ByteArrayOutputStream implements URIConverter.Saveable {
    private GitHandler handler;
    private URI uri;
    private Map<?, ?> options;

    public GitOutputStream(GitHandler handler, URI uri, Map<?, ?> options) {
        this.handler = handler;
        this.uri = uri;
        this.options = options;
    }

    @Override
    public void saveResource(Resource resource) throws IOException {
        Transaction transaction = handler.getTransaction();
        Database db = transaction.getDatabase();
        String id = db.getResourceId(resource);
        boolean isNew = id == null || id.length() == 0;
        String rev = isNew ? null : db.checkAndGetRev(uri);
        Resource oldResource = null;
        if (!isNew) {
            EntityId oldEntityId = new EntityId(id, rev);
            Entity oldEntity = transaction.load(oldEntityId);
            oldResource = db.entityToResource(transaction, oldEntity);
            db.getEvents().fireBeforeUpdate(oldResource, resource, transaction);
        }
        else {
            db.getEvents().fireBeforeInsert(resource, transaction);
        }
        byte[] content = db.getResourceContent(resource);
        Entity entity = new Entity(id, rev, content);
        if (isNew) {
            transaction.create(entity);
            id = entity.getId();
        }
        else {
            transaction.update(entity);
        }
        rev = entity.getRev();
        URI newURI = db.createURI(id, rev);
        resource.setURI(newURI);
        if (isNew) {
            db.getEvents().fireAfterInsert(resource, transaction);
        }
        else {
            db.getEvents().fireAfterUpdate(oldResource, resource, transaction);
        }
    }
}
