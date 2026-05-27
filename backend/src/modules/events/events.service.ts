import { prisma } from '../../utils/prisma';

export const getAllEventsService = async () => {

    const events = await prisma.event.findMany();

    return events;

}

export const enrollUserInEventService = async (userId: string, eventId: string) => {

    const checkEvent = await prisma.event.findUnique({
        where: {
            id: eventId
        }
    });

    if (!checkEvent) {
        throw new Error('Event not found');
    }

    const checkUser = await prisma.professionalProfile.findUnique({
        where: {
            userId
        }
    });

    if (!checkUser) {
        throw new Error('User not found');
    }

    await prisma.eventEnroll.create({
        data: {
            eventId: eventId,
            professionalId: checkUser.id
        }
    })

    return 'User enrolled in event successfully';

}

export const createEventService = async (title: string, type: string, day: string, link: string ) => {

    await prisma.event.create({
        data: {
            title,
            type,
            day,
            link
        }
    });

    return 'Event created successfully';

}