REPO=painejs/pantry-for-good

docker login -u $QUAYIO_USERNAME -p $QUAYIO_PASSWORD

docker build -t $REPO
docker tag $REPO $REPO:latest
docker tag $REPO $REPO:$TRAVIS_BUILD_NUMBER
docker push $REPO