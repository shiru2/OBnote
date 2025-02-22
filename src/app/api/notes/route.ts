import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const note = await prisma.note.findUnique({
        where: { id }
      });
      
      if (!note) {
        return NextResponse.json(
          { error: 'Note not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(note);
    }

    const notes = await prisma.note.findMany();
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Notes API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        tags: tags || [],
      }
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Notes API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    const existingNote = await prisma.note.findUnique({
      where: { id }
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, content, tags } = body;

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title: title || existingNote.title,
        content: content || existingNote.content,
        tags: tags || existingNote.tags,
        version: { increment: 1 }
      }
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Notes API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    await prisma.note.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notes API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
