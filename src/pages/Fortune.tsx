import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import AnimalCard from "../components/AnimalCard";
import { animals } from "../data/dummyData";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Fortune = () => {
  const [searchParams] = useSearchParams();
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);

  useEffect(() => {
    const animalId = searchParams.get("animal");
    if (animalId) {
      setSelectedAnimal(Number(animalId));
    }
  }, [searchParams]);

  const handleAnimalClick = (animalId: number) => {
    setSelectedAnimal(animalId);
  };

  const selectedFortune = selectedAnimal
    ? animals.find((animal) => animal.id === selectedAnimal)?.fortune
    : null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo text-center">
          오늘의 운세
        </h1>
        <p className="text-gray-600 mb-10 text-center">
          동물 캐릭터를 선택하여 오늘의 운세를 확인해보세요
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
          {animals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal.name}
              emoji={animal.emoji}
              onClick={() => handleAnimalClick(animal.id)}
            />
          ))}
        </div>

        {selectedAnimal && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-indigo">
                {animals.find((animal) => animal.id === selectedAnimal)?.name}의
                오늘의 운세
              </h2>
              <p className="text-gray-700 leading-relaxed">{selectedFortune}</p>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                더 자세한 운세가 궁금하신가요?
              </p>
              <Link to="/saju-input" className="primary-button inline-flex">
                사주 입력하기 <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Fortune;
