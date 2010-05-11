require 'rubygems'
require 'sinatra'
require 'haml'
require 'sass'
require 'uri'
require 'net/https'
require 'yajl'

set :haml, {:format => :html5}

# Render a json response
def json(hash = {})
  content_type 'application/json'
  Yajl::Encoder.encode(hash, {:pretty => true, :indent => '  '})
end

# Give the app page to the browser
get '/' do
  haml :index
end

# Do stuff
post '/' do
  begin
    url = URI.parse(params[:url])
    
    socket = Net::HTTP.new(url.host, url.port)
    socket.use_ssl = true
    socket.verify_mode = OpenSSL::SSL::VERIFY_NONE
    
    req = url.path.empty? ? Net::HTTP::Post.new('/') : Net::HTTP::Post.new(url.path)
    req.basic_auth(url.user, url.password) if url.user && url.password
    req.content_type = 'application/xml'
    
    response = socket.request(req, params[:soap])
    
    json :soap => response.body
  rescue => e
    json :error => e
  end
end

# Respond to css requests with sass templates
get '/css/*.css' do |stylesheet|
  content_type 'text/css'
  sass stylesheet.to_sym
end
