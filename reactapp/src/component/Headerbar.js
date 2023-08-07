import React from 'react';

function Headerbar() {
    return (
      
            <nav className="navbar navbar-expand navbar-light navbar-bg">
						<a className="sidebar-toggle js-sidebar-toggle ">
          <i className="hamburger align-self-center"></i>
        </a>

				<div className="navbar-collapse collapse">
					<ul className="navbar-nav navbar-align">
						

						<li className="nav-item dropdown">
			

							<a className="nav-link dropdown-toggle d-none d-sm-inline-block" href="#" >
                <img src="../../admin/img/avatars/avatar.jpg" className="avatar img-fluid rounded me-1" alt="Charles Hall" /> <span className="text-dark">Charles Hall</span>
              </a>
							
						</li>
					</ul>
				</div>
			</nav>
      
    );
}

export default Headerbar;