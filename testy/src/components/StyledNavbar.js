import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className='navbar'>
           <NavLink 
                to='/' 
                style={({isActive}) => {
                return { color: isActive ? 'red' : 'grey'};
                }}
            >
                Home
            </NavLink>
           
           <NavLink 
                to='/fetch'
                style={({isActive}) => {
                    return { color: isActive ? 'red' : 'grey'};
                    }}
            >
                Fetch
            </NavLink>
   
        </nav>
    )
}

export default Navbar;