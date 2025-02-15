import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { IconButton } from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

export default function AnchorTemporaryDrawer() {
    const [open, setOpen] = useState(false);


    return (
        <div>

            <IconButton onClick={() => setOpen(true)}>
                <MenuRoundedIcon className='links' />
            </IconButton>
            <Drawer
                anchor={"right"}
                open={open}
                onClose={() => setOpen(false)}
            >
                <div className='drawer-div'>
                    <Link to="/">
                        <p className="link">Home</p>
                    </Link>
                    <Link to="/compare">
                        <p className="link">Compare</p>
                    </Link>
                    <Link to="/watchlist">
                        <p className="link">Watchlist</p>
                    </Link>
                    <Link to="/dashboard">
                        <Button text={"Dashboard"} outlined={true} />
                    </Link>
                    <Link to="/login">
                        <Button text={"Login"} />
                    </Link>
                </div>
            </Drawer>

        </div>
    );
}