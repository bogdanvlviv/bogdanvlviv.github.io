docker-prepare:
	docker-compose build
	docker-compose run jekyll bundle install

docker-jekyll:
	docker-compose up jekyll
