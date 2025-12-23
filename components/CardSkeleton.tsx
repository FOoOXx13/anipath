
 
 const CardSkeleton = () => {

  return (
       <div className=" h-[280px] md:h-[400px] bg-bg-dark rounded-xl flex flex-col items-center >">

      <div  className="w-full h-[180px] md:h-[300px] bg-(--bg-light) rounded-xl " />
 
      <div className="w-full flex flex-col px-4 gap-2 mt-2">
        <div className="w-24 md:wd-30 bg-(--bg-light) h-4 rounded-2xl"></div>

        <div className="w-full flex flex-col gap-2">

        <div className="w-20  bg-(--bg-light) h-2 rounded-2xl"></div>
        <div className="w-20 bg-(--bg-light) h-2 rounded-2xl"></div>

        </div>
      </div>
    </div>
  )
}

export default CardSkeleton