function header() {

    return (
      <>
    <header class="header">
        <div class="logo">Tasty Recipe Saver</div>
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                aria-expanded="false" style="background-color: #745E96;">
                Menu
            </button>
            <nav class="dropdown-menu">
                <li><button class="dropdown-item" type="button">Home</button></li>
                <li><button class="dropdown-item" type="button">My Recipe</button></li>
            </nav>
        </div>
    </header>
      </>
    )
  }
  
  export default header
  