#version 430

in vec3 vertPos;
in vec3 N;
in vec3 lightPos;
/*TODO:: Complete your shader code for a full Phong shading*/ 
struct Material // Material struct
{
	 vec3 Kd;            // Diffuse reflectivity
	 vec3 Ka;			//Ambiant reflectivity
	 vec3 Ks;			//Specular reflectivity
};

struct Light // Light struct
{
	 vec3 Ld;            // Diffuse light intensity
	 vec3 La;			//Ambiant light intensity
	 vec3 Ls;			//Specular light intensity
};

uniform Material materials;
uniform Light light;
//camera pos
uniform vec3 viewPos;
// complete to a full phong shading
layout( location = 0 ) out vec4 FragColour;
//Calculate the light vector
vec3 L = normalize(lightPos - vertPos);  // Normalizing vector between light position and vertex position

vec4 Diffuse()
{
	//calculate Diffuse Light Intensity making sure it is not negative and is clamped 0 to 1  
	vec4 dif = vec4(light.Ld, 1.0) * max(dot(N, L), 0.0);	// Vec4 is used because the fragcolour is Vec4
	dif = clamp(dif, 0.0, 1.0); //  this makes sure that the value is between 0 and 1
	return vec4(materials.Kd, 1.0) * dif;
}

vec4 Ambient(float AmbScaler)
{
	//Ambient light
	vec3 amb = materials.Ka * light.La * AmbScaler; //  calculate the ambiant light
	return vec4 (amb, 1.0f);
}
vec4 Specular()
{
	//Specular light
	float specularStrength = 0.5;
	vec3 viewDir = normalize(viewPos - vertPos); // camera view calculation
	vec3 reflectDir = reflect(-L, N); // light reflection
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32); // andgle between the camera and the reflection of the light
	vec3 specular = light.Ls * spec * materials.Ks;
	return vec4(specular, 1.0f);
}

float Attenuation()
{	//parameters for the attenuation calculation
	float attenuationLinear = 0.005f;
	float attenuationQuadratic = 0.002f;

	float DistToLight = distance(vertPos, lightPos); // Distance to the light calculation
	float DistSquared = pow(DistToLight, 2); //distance squared calculation
	return 1 / (0.5 + (DistToLight * attenuationLinear) + (DistSquared * attenuationQuadratic)); // calculation the attenuation
}

// calculating all Phong lighting
vec4 LightCalc(float AmbScaler) //creating ambiant scaler
{
	vec4 amb = Ambient(AmbScaler);//passing through the ambiant scaler 
	vec4 dif = Diffuse();
	vec4 spec = Specular();
	float atten = Attenuation();
	return vec4 (amb + (dif * atten) + (spec * atten)); 
}

void main()
{

	vec4 results = LightCalc(0.3); // using the ambiant scaler to change the parameters. these can be easily increased and decreased 
	FragColour = results;
	 
}
