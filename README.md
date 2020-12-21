The code here supports the [Katacoda scenario that teaches the importance of Kubernetes Probes](https://katacoda.com/javajon/courses/kubernetes-fundamentals/probes). Got 30 minutes? It's free, give it a try! Your feedback is welcomed!

To run this app locally [install Node](https://nodejs.org/en/download/) and run:

`node src/app.js`

or

```bash
docker build -t [registry]/probe-app .
docker run --rm [registry]/probe-app -p 3000:3000
```

However, the [Katacoda scenario](https://katacoda.com/javajon/courses/kubernetes-fundamentals/probes) will walk you through the journey of learning Probes on Kubernetes using this app.
