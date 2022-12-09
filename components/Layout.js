import Nav from "./nav";



export default function Layout({children}){
    return(
        <div className="mx-6 md:mx-w-2xl md:mx-auto px-4 bg-slate-100 ">
            <Nav />
            <main>{children}</main>
        </div>
    )
}
