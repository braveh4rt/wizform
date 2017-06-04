<div class="stepwizard col-md-offset-3">
    <div class="stepwizard-row setup-panel">
      <% _.each(step, function (item) { %>
          <div class="stepwizard-step">
              <button type="button" 
                <% if(item.status === "disabled") { %> 
                    class="btn default badge disabled btn-circle"
                <% } else if (item.status === "active") { %>
                    class="btn btn-primary badge badge-info btn-circle"
                <% } else if (item.status === "complete") { %>
                    class="btn btn-green badge badge-success btn-circle"
                <% } %>
                >
              <%- item.id %></button>
              <p><%- item.label %></p>
          </div>
      <% }); //end each%>
    </div>
</div>
