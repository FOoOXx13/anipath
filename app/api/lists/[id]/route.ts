import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";

export async function GET(req:Request,{params} : {params:{id:string}}) {
    const {userId} = await auth()

    if(!userId) {
        return new Response("Unauthorized", {status:401})
    }

    await connectDB()

    const list = await List.findOne({
        _id: params.id,
        userId,
    }).lean();


  if (!list) {
    return new Response("List not found", { status: 404 });
  }

    return Response.json({
    _id: list._id.toString(),
    name: list.name,
    animeIds: list.animeIds,
  });
}

export async function DELETE(  req: Request, { params }: { params: Promise<{ id: string }> }) {
  const {userId} = await auth();
  const {id} = await params;

  if(!userId) {
    return new Response("Unauthotized", {status:401})
  }

  await connectDB();

  const list = await List.findOne({
    _id:id,
    userId,
  }).lean();

    if (!list) {
    return new Response("List not found", { status: 404 });
  }

  if(list.isDefault){
    return new Response("Default lists cannot be deleted", {status:404})
  }

  await List.deleteOne({_id: list._id});

  return Response.json({success:true});

}