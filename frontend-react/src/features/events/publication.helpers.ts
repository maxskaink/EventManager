import type { ContentItem } from "./types";

export const translatePublicationType = (type: API.PublicationType, defaultValue?: string) => {
    switch (type) {
        case "articulo":
            return "Artículo";
        case "aviso":
            return "Aviso";
        case "comunicado":
            return "Comunicado";
        case "material":
            return "Material";
        case "evento":
            return "Evento";
        default:
            return defaultValue ?? "No se ha definido un tipo";
    }
}
export const translatePublicationStatus = (status: API.PublicationStatus, defaultValue?: string) => {
    switch (status) {
        case "activo":
            return "Activo";
        case "inactivo":
            return "Inactivo";
        case "borrador":
            return "Borrador";
        case "pendiente":
            return "Pendiente";
        default:
            return defaultValue ?? "No se ha definido un estado";
    }
}

export const translatePublicationVisibility = (visibility: API.PublicationVisibility, defaultValue?: string) => {
    switch (visibility) {
        case "public":
            return "Público";
        case "private":
            return "Restringido (Por permisos)";
        case "role_based":
            return "Role-based";
        default:
            return defaultValue ?? "Restringido (Por permisos)";
    }
}


export const publicationToContentItem = (publication: API.Publication): ContentItem => {
    const associatedEvent = publication.event;

    // Base item
    const item: ContentItem = {
        id: `pub-${publication.id}`,
        type: publication.type,
        title: publication.title,
        description: publication.summary || publication.content || "",
        date: publication.published_at ? publication.published_at.split("T")[0] : publication.created_at.split("T")[0],
        status: publication.status,
        kind: 'publication',
        original: publication,
    };

    // Enrichment if event exists
    if (associatedEvent) {
        item.subtype = associatedEvent.event_type;
        item.date = associatedEvent.start_date.split("T")[0];
        item.time = associatedEvent.start_date.split("T")[1]?.substring(0, 5);
        item.location = associatedEvent.location || associatedEvent.modality;
        item.capacity = associatedEvent.capacity ?? undefined;
        item.eventId = associatedEvent.id.toString();
        item.original = { ...publication, ...associatedEvent, image_url: publication.image_url };
    }
    return item;
}