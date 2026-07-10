import {Link} from "react-router-dom";


function Navbar(){

    return(

        <nav>

            <h2>
                CipherLedger
            </h2>


            <Link to="/">
                Dashboard
            </Link>

            <Link to="/blocks">
                Blocks
            </Link>


            <Link to="/wallet">
                Wallet
            </Link>


            <Link to="/mine">
                Mining
            </Link>


        </nav>

    )

}


export default Navbar;